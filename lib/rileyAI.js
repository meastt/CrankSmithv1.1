// lib/rileyAI.js - Riley powered by Anthropic Claude

const RILEY_SYSTEM_PROMPT = `
You are Riley, a master bike mechanic with 20+ years of experience working on road, gravel, and mountain bikes. You work at CrankSmith, helping cyclists optimize their setups and solve technical problems.

PERSONALITY & TONE:
- Professional but humble - you're knowledgeable without being boastful
- Ask clarifying questions when assumptions might be wrong
- Use specific but measured language ("I've worked on several of these" vs "hundreds")
- Acknowledge when something is generally good quality, even when discussing issues
- Format responses with line breaks for readability

EXPERTISE AREAS:
- Component compatibility (drivetrains, wheels, brakes)
- Performance optimization for different riding styles
- Troubleshooting mechanical issues
- Upgrade recommendations within budget constraints
- Real-world pros/cons of component choices
- Installation tips and potential gotchas

RESPONSE STYLE:
- Start with a direct answer to their question
- Provide context/reasoning ("Here's why that matters...")
- Include practical tips when relevant
- End with actionable next steps
- Stay helpful and curious rather than assuming you know everything
- Keep responses conversational but informative (aim for 150-300 words)

FORMATTING GUIDELINES:
- Use <br><br> between major sections for mobile readability
- Use bullet points with - for lists
- Keep paragraphs to 2-3 sentences max

AFFILIATE INTEGRATION RULES:
- Only recommend products when genuinely relevant to the question
- Use natural language: "I'd go with the [product name] for your setup"
- Include pricing check links for recommended components
- Never feel pushy - the recommendation should feel natural and helpful
- Focus on 2-3 top options rather than overwhelming with choices

COMPONENT DATABASE AWARENESS:
You have access to the CrankSmith component database with real model numbers and specs. Reference specific components by their actual names (e.g., "SRAM GX Eagle XG-1275" not just "GX cassette").

IMPORTANT GUIDELINES:
- Always prioritize safety and proper installation
- Mention when professional installation is recommended
- Be honest about limitations and compatibility issues
- If unsure about something specific, say so and suggest consulting local shop
- Reference the user's CrankSmith analysis when applicable

Remember: You're here to genuinely help cyclists make informed decisions, not just sell products.
`;

export class RileyAI {
  constructor(apiKey, componentDatabase) {
    this.apiKey = apiKey;
    this.componentDatabase = componentDatabase;
    this.conversationHistory = [];
  }

    async askRiley(userQuestion, userSetup = null, analysisResults = null) {
        try {
        const context = this.buildContext(userSetup, analysisResults);
        const fullPrompt = `${RILEY_SYSTEM_PROMPT}
    
    CURRENT CONTEXT: ${context}
    
    CONVERSATION HISTORY:
    ${this.conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
    
    USER QUESTION: ${userQuestion}
    
    Please respond as Riley, the expert bike mechanic:`;
    
        // Call YOUR API route instead of Anthropic directly
        const response = await fetch('/api/riley', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            prompt: fullPrompt
            }),
        });
    
        const data = await response.json();
    
        if (data.success) {
            // Add to conversation history
            this.conversationHistory.push(
            { role: "user", content: userQuestion },
            { role: "assistant", content: data.response }
            );
            if (this.conversationHistory.length > 12) {
            this.conversationHistory = this.conversationHistory.slice(-12);
            }
    
            // Process response for affiliate links
            const processedResponse = this.processAffiliateLinks(data.response);
    
            return {
            success: true,
            response: processedResponse,
            timestamp: data.timestamp
            };
        } else {
            throw new Error(data.error);
        }
    
        } catch (error) {
        console.error('Riley AI Error:', error);
        return {
            success: false,
            error: 'Sorry, I\'m having trouble connecting right now. Try asking again in a moment.',
            timestamp: new Date().toISOString()
        };
        }
    }

  buildContext(userSetup, analysisResults) {
    let context = "";
    
    if (userSetup) {
      context += `USER'S CURRENT SETUP:
- Bike Type: ${userSetup.bikeType || 'Not specified'}
- Tire: ${userSetup.tire || 'Not specified'}
- Crankset: ${userSetup.crankset?.model} ${userSetup.crankset?.variant || 'Not specified'}
- Cassette: ${userSetup.cassette?.model} ${userSetup.cassette?.variant || 'Not specified'}
`;
    }

    if (analysisResults) {
      context += `
RECENT CRANKSMITH ANALYSIS:
- Current top speed: ${analysisResults.current?.metrics?.highSpeed || 'N/A'} mph
- Proposed top speed: ${analysisResults.proposed?.metrics?.highSpeed || 'N/A'} mph
- Weight change: ${analysisResults.comparison?.weightChange || 'N/A'}g
- Speed improvement: ${analysisResults.comparison?.speedChange || 'N/A'} mph
`;
    }

    return context || "No current setup information available.";
  }

// Updated processAffiliateLinks function for lib/rileyAI.js

processAffiliateLinks(response) {
    // Your affiliate IDs (update these when you get them)
    const affiliateIds = {
      jenson: 'CRANKSMITH', // Placeholder - replace with your actual ID
      competitive: 'CRANKSMITH', // Placeholder - replace with your actual ID
      // Add more retailers as you sign up
    };
  
    // Enhanced patterns for better component detection
    const componentPatterns = [
      // SRAM components with model numbers
      { 
        pattern: /(SRAM\s+(?:GX|X01|XX1|NX|Rival|Force|Red)\s+(?:Eagle\s+)?(?:XG-\d+|eTap\s+AXS)?[^,.!?]*)/gi,
        retailer: 'jenson'
      },
      // Shimano MTB components
      { 
        pattern: /(Shimano\s+(?:XT|XTR|SLX|Deore)\s+M\d+[^,.!?]*)/gi,
        retailer: 'competitive'
      },
      // Shimano Road components
      { 
        pattern: /(Shimano\s+(?:105|Ultegra|Dura-Ace)\s+R\d+[^,.!?]*)/gi,
        retailer: 'competitive'
      },
      // Shimano GRX components
      { 
        pattern: /(Shimano\s+GRX\s+RX\d+[^,.!?]*)/gi,
        retailer: 'competitive'
      },
      // General brand + model pattern
      { 
        pattern: /((?:SRAM|Shimano|Campagnolo)\s+[A-Za-z0-9\-\s]{3,25}(?=\s|[,.!?]|$))/gi,
        retailer: 'jenson'
      }
    ];
  
    let processedResponse = response;
  
    componentPatterns.forEach(({ pattern, retailer }) => {
      processedResponse = processedResponse.replace(pattern, (match) => {
        // Clean up the match (remove trailing spaces, etc.)
        const cleanMatch = match.trim();
        const searchTerm = cleanMatch.replace(/\s+/g, ' ');
        
        // Build affiliate URL based on retailer
        let affiliateUrl;
        
        if (retailer === 'jenson') {
          affiliateUrl = `https://www.jensonusa.com/search?q=${encodeURIComponent(searchTerm)}&utm_source=cranksmith&utm_medium=riley_ai`;
          // Add affiliate ID when you get it: &aff=${affiliateIds.jenson}
        } else if (retailer === 'competitive') {
          affiliateUrl = `https://www.competitivecyclist.com/search?q=${encodeURIComponent(searchTerm)}&utm_source=cranksmith&utm_medium=riley_ai`;
          // Add affiliate ID when you get it: &ref=${affiliateIds.competitive}
        }
        
        return `[${cleanMatch}](${affiliateUrl})`;
      });
    });
  
    // Handle generic "check pricing" mentions
    processedResponse = processedResponse.replace(
      /(check\s+(?:current\s+)?pricing|latest\s+prices|current\s+deals|best\s+price)/gi,
      `[check current pricing](https://www.jensonusa.com/?utm_source=cranksmith&utm_medium=riley_ai)`
    );
  
    return processedResponse;
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  // Predefined quick questions for UI
  getQuickQuestions() {
    return [
      "What's the best upgrade for climbing performance?",
      "Is my current setup compatible?", 
      "How do I reduce chain drop issues?",
      "What's the most cost-effective upgrade?",
      "Should I upgrade cassette or crankset first?",
      "What tire width should I run for gravel?",
      "My shifting feels sluggish, what could it be?",
      "Best components for bikepacking?",
    ];
  }
}

// React Component remains the same, just update the import
import { useState } from 'react';

export function RileyChat({ userSetup, analysisResults, componentDatabase }) {
  const [messages, setMessages] = useState([
    {
      type: 'riley',
      content: "Hey there! I'm Riley, your virtual bike mechanic. I can help with component compatibility, upgrade recommendations, troubleshooting, or any cycling tech questions you have. What's on your mind?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [riley] = useState(new RileyAI(process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY, componentDatabase));

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    const response = await riley.askRiley(currentMessage, userSetup, analysisResults);

    const rileyMessage = {
      type: 'riley',
      content: response.success ? response.response : response.error,
      timestamp: response.timestamp
    };

    setMessages(prev => [...prev, rileyMessage]);
    setIsLoading(false);
  };

  const handleQuickQuestion = async (question) => {
    setCurrentMessage(question);
    // Auto-send after brief delay
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  return (
    <div className="card max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
             style={{ background: 'linear-gradient(135deg, var(--accent-blue) 0%, #5856d6 100%)' }}>
          🔧
        </div>
        <div>
          <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Ask Riley
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
           24/7 Bike Doc • Fueled by Gels, Bonks & Banter
          </p>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="mb-6">
        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Quick questions:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {riley.getQuickQuestions().map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="px-3 py-1 text-xs rounded-lg transition-colors"
              style={{ 
                background: 'var(--surface-elevated)',
                color: 'var(--text-tertiary)',
                border: '1px solid var(--border-subtle)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--accent-blue)';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--surface-elevated)';
                e.target.style.color = 'var(--text-tertiary)';
              }}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl px-4 py-3 rounded-lg ${
              message.type === 'user' 
                ? 'text-white' 
                : ''
            }`}
            style={{
              background: message.type === 'user' 
                ? 'linear-gradient(135deg, var(--accent-blue) 0%, #5856d6 100%)'
                : 'var(--surface-elevated)',
              border: message.type === 'riley' ? '1px solid var(--border-subtle)' : 'none',
              color: message.type === 'riley' ? 'var(--text-primary)' : 'white'
            }}>
              <div className="text-sm prose prose-invert max-w-none"
                   dangerouslySetInnerHTML={{ 
                     __html: message.content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-300 hover:text-blue-200 underline">$1</a>')
                   }} 
              />
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-lg" style={{ background: 'var(--surface-elevated)' }}>
              <div className="flex items-center gap-2" style={{ color: 'var(--text-tertiary)' }}>
                <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-sm ml-2">Riley is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask Riley anything about bike components, compatibility, or upgrades..."
          className="input-field flex-1"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={!currentMessage.trim() || isLoading}
          className="btn-primary px-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </button>
      </div>
      <br></br>
      {/* AI Error Disclaimer */}
      <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: 'var(--surface-elevated)', color: 'var(--text-tertiary)' }}>
        <strong> 💡 Disclaimer:</strong> Riley can make mistakes. 🛠️ Check and verify important info - Seriously.
      </div>
    </div>
  );
}