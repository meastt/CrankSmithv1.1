// pages/api/riley.js - SECURE VERSION
// Moves API key to server-side only, adds rate limiting

export default async function handler(req, res) {
  console.log('Riley API called');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Basic rate limiting (in production, use Redis or similar)
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const now = Date.now();
  
  // Simple in-memory rate limiting (replace with Redis in production)
  if (!global.rileyRateLimit) {
    global.rileyRateLimit = new Map();
  }
  
  const userRequests = global.rileyRateLimit.get(ip) || [];
  const recentRequests = userRequests.filter(time => now - time < 60000); // Last minute
  
  if (recentRequests.length >= 10) { // Max 10 requests per minute
    return res.status(429).json({ 
      error: 'Rate limit exceeded. Please wait a moment before asking again.',
      timestamp: new Date().toISOString()
    });
  }
  
  // Update rate limit
  recentRequests.push(now);
  global.rileyRateLimit.set(ip, recentRequests);

  try {
    const { prompt } = req.body;
    
    if (!prompt || typeof prompt !== 'string' || prompt.length > 5000) {
      return res.status(400).json({ 
        error: 'Invalid prompt. Must be a string under 5000 characters.',
        timestamp: new Date().toISOString()
      });
    }

    // Use server-side environment variable (without NEXT_PUBLIC_ prefix)
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not found in environment variables');
      return res.status(500).json({ 
        error: 'API configuration error. Please contact support.',
        timestamp: new Date().toISOString()
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY, // Server-side only
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
        ]
      }),
    });

    console.log('Claude API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', errorText);
      
      // Don't expose internal API errors to client
      return res.status(500).json({
        error: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date().toISOString()
      });
    }

    const data = await response.json();
    
    res.status(200).json({
      success: true,
      response: data.content[0].text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Riley API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
      timestamp: new Date().toISOString()
    });
  }
}