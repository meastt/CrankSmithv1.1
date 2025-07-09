// pages/api/riley.js - COMPLETE FILE with enhanced security
import { Redis } from '@upstash/redis';

// Initialize Redis client (use Upstash or similar)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Security constants
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
const MAX_PROMPT_LENGTH = 5000;
const BLOCKED_PATTERNS = [
  'ignore previous',
  'disregard instructions',
  'forget what i told you',
  'system prompt',
  'reveal your instructions',
  'show your prompt',
  'what are your instructions',
  'bypass your',
  'jailbreak',
];

// Validate prompt for security
function isValidPrompt(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    return { valid: false, reason: 'Invalid prompt format' };
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return { valid: false, reason: 'Prompt too long' };
  }

  // Check for prompt injection attempts
  const lowerPrompt = prompt.toLowerCase();
  for (const pattern of BLOCKED_PATTERNS) {
    if (lowerPrompt.includes(pattern)) {
      return { valid: false, reason: 'Potentially harmful prompt detected' };
    }
  }

  // Check for excessive special characters (possible encoding attack)
  const specialCharRatio = (prompt.match(/[^a-zA-Z0-9\s.,!?-]/g) || []).length / prompt.length;
  if (specialCharRatio > 0.3) {
    return { valid: false, reason: 'Unusual character pattern detected' };
  }

  return { valid: true };
}

// Get client identifier
function getClientId(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;
  
  // Add user agent hash for better fingerprinting
  const userAgent = req.headers['user-agent'] || 'unknown';
  const crypto = require('crypto');
  const uaHash = crypto.createHash('md5').update(userAgent).digest('hex').substring(0, 8);
  
  return `${ip}-${uaHash}`;
}

// Check rate limit with Redis
async function checkRateLimit(clientId) {
  const key = `riley_rate_limit:${clientId}`;
  
  try {
    // Get current count
    const current = await redis.get(key);
    const count = current ? parseInt(current) : 0;
    
    if (count >= MAX_REQUESTS_PER_WINDOW) {
      return { allowed: false, retryAfter: RATE_LIMIT_WINDOW / 1000 };
    }
    
    // Increment count
    const pipeline = redis.pipeline();
    pipeline.incr(key);
    pipeline.expire(key, Math.ceil(RATE_LIMIT_WINDOW / 1000));
    await pipeline.exec();
    
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - count - 1 };
  } catch (error) {
    console.error('Redis error:', error);
    // Fallback to allowing request if Redis fails
    return { allowed: true, remaining: -1 };
  }
}

// Log suspicious activity
async function logSuspiciousActivity(clientId, reason) {
  const key = `riley_suspicious:${clientId}`;
  const timestamp = new Date().toISOString();
  
  try {
    await redis.zadd(key, {
      score: Date.now(),
      member: `${timestamp}:${reason}`
    });
    
    // Keep logs for 7 days
    await redis.expire(key, 7 * 24 * 60 * 60);
  } catch (error) {
    console.error('Failed to log suspicious activity:', error);
  }
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientId = getClientId(req);
  
  try {
    // Check rate limit
    const rateLimitResult = await checkRateLimit(clientId);
    
    if (!rateLimitResult.allowed) {
      res.setHeader('Retry-After', rateLimitResult.retryAfter);
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please wait before making another request.',
        retryAfter: rateLimitResult.retryAfter,
        timestamp: new Date().toISOString()
      });
    }
    
    // Add rate limit headers
    if (rateLimitResult.remaining >= 0) {
      res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW);
      res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining);
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString());
    }

    const { prompt } = req.body;
    
    // Validate prompt
    const validation = isValidPrompt(prompt);
    if (!validation.valid) {
      await logSuspiciousActivity(clientId, validation.reason);
      return res.status(400).json({ 
        error: validation.reason,
        timestamp: new Date().toISOString()
      });
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not configured');
      return res.status(500).json({ 
        error: 'Service temporarily unavailable. Please try again later.',
        timestamp: new Date().toISOString()
      });
    }

    // Make API request with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          system: "You are Riley, a helpful bike mechanic assistant. Provide concise, accurate advice about bike components and compatibility."
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Claude API error:', response.status, errorData);
        
        return res.status(500).json({
          error: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
          timestamp: new Date().toISOString()
        });
      }

      const data = await response.json();
      
      // Sanitize response
      const responseText = data.content[0].text
        .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove scripts
        .replace(/javascript:/gi, '') // Remove javascript: URIs
        .substring(0, 2000); // Limit response length
      
      res.status(200).json({
        success: true,
        response: responseText,
        timestamp: new Date().toISOString()
      });

    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        return res.status(504).json({
          error: 'Request timeout. Please try again.',
          timestamp: new Date().toISOString()
        });
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Riley API Error:', error);
    
    // Log error but don't expose internal details
    await logSuspiciousActivity(clientId, `Error: ${error.message}`);
    
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
      timestamp: new Date().toISOString()
    });
  }
}

// Export config for Vercel
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10kb',
    },
  },
};
