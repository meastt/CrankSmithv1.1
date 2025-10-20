// lib/rileyAI.js - Enhanced Riley with gear analysis integration and PWA optimization
// UPDATED: Added contextual gear analysis, compatibility checking, and mobile-optimized responses

const RILEY_SYSTEM_PROMPT = `
You are Riley, a master bike mechanic with 20+ years of experience working on road, gravel, and mountain bikes. You work at CrankSmith, helping cyclists optimize their setups and solve technical problems.

PERSONALITY & TONE:
- Professional but humble - you're knowledgeable without being boastful
- Ask clarifying questions when assumptions might be wrong
- Use specific but measured language ("I've worked on several of these" vs "hundreds")
- Acknowledge when something is generally good quality, even when discussing issues
- Format responses with line breaks for readability
- Keep responses concise for mobile users (150-250 words ideal)

EXPERTISE AREAS:
- Component compatibility (drivetrains, wheels, brakes)
- Performance optimization for different riding styles
- Troubleshooting mechanical issues
- Upgrade recommendations within budget constraints
- Real-world pros/cons of component choices
- Installation tips and potential gotchas
- Gear ratio analysis and terrain suitability

RESPONSE STYLE:
- Start with a direct answer to their question
- Provide context/reasoning ("Here's why that matters...")
- Include practical tips when relevant
- End with actionable next steps
- Stay helpful and curious rather than assuming you know everything
- Keep responses conversational but informative
- Use mobile-friendly formatting (short paragraphs, bullet points)

FORMATTING GUIDELINES:
- Use <br><br> between major sections for mobile readability
- Use bullet points with - for lists
- Keep paragraphs to 2-3 sentences max
- Bold key recommendations with **text**

GEAR ANALYSIS INTEGRATION:
When provided with gear analysis data, focus on:
- Practical implications of the gear ratios
- Terrain suitability based on gear inches
- Compatibility concerns and solutions
- Performance trade-offs explained simply
- Specific recommendations for the user's riding style

COMPATIBILITY EXPERTISE:
You understand derailleur capacity calculations, chain line issues, speed compatibility, and can explain complex compatibility problems in simple terms.

IMPORTANT GUIDELINES:
- Always prioritize safety and proper installation
- Mention when professional installation is recommended
- Be honest about limitations and compatibility issues
- If unsure about something specific, say so and suggest consulting local shop
- Reference the user's CrankSmith analysis when applicable
- Optimize responses for mobile reading (shorter sentences, clear structure)

Remember: You're here to genuinely help cyclists make informed decisions about their gear setups.
`;

export class RileyAI {
  constructor(componentDatabase) {
    this.componentDatabase = componentDatabase;
    this.conversationHistory = [];
  }

  async askRiley(userQuestion, userSetup = null, _analysisResults = null, bikeType = null) {
    try {
      const context = this.buildEnhancedContext(userSetup, _analysisResults, bikeType);
      const fullPrompt = `${RILEY_SYSTEM_PROMPT}

CURRENT CONTEXT: ${context}

CONVERSATION HISTORY:
${this.conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

USER QUESTION: ${userQuestion}

Please respond as Riley, the expert bike mechanic. Keep it mobile-friendly and actionable:`;

      // Call your API route
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
        
        // Keep history manageable for mobile
        if (this.conversationHistory.length > 10) {
          this.conversationHistory = this.conversationHistory.slice(-10);
        }

        // Process response for affiliate links and mobile optimization
        const processedResponse = this.processResponseForMobile(data.response);

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

  buildEnhancedContext(userSetup, analysisResults, bikeType) {
    let context = "";
    
    if (bikeType) {
      context += `BIKE TYPE: ${bikeType.charAt(0).toUpperCase() + bikeType.slice(1)} bike\n`;
    }
    
    if (userSetup) {
      context += `USER'S SETUP:
- Wheel: ${userSetup.wheel || 'Not specified'}
- Tire: ${userSetup.tire || 'Not specified'}mm
- Crankset: ${this.formatComponent(userSetup.crankset)}
- Cassette: ${this.formatComponent(userSetup.cassette)}
`;
    }

    if (analysisResults) {
      const { current, proposed, comparison } = analysisResults;
      
      context += `
CRANKSMITH ANALYSIS RESULTS:
Performance Comparison:
- Current top speed: ${current?.metrics?.highSpeed || 'N/A'} mph
- Proposed top speed: ${proposed?.metrics?.highSpeed || 'N/A'} mph
- Current climbing speed: ${current?.metrics?.lowSpeed || 'N/A'} mph  
- Proposed climbing speed: ${proposed?.metrics?.lowSpeed || 'N/A'} mph
- Weight change: ${comparison?.weightChange || 'N/A'}g
- Speed improvement: ${comparison?.speedChange || 'N/A'} mph
- Range change: ${comparison?.rangeChange || 'N/A'}%

Current Setup Analysis:
- Weight: ${current?.totalWeight || 'N/A'}g
- Gear range: ${current?.gearRange || 'N/A'}%
- High ratio: ${current?.metrics?.highRatio || 'N/A'}
- Low ratio: ${current?.metrics?.lowRatio || 'N/A'}

Proposed Setup Analysis:
- Weight: ${proposed?.totalWeight || 'N/A'}g  
- Gear range: ${proposed?.gearRange || 'N/A'}%
- High ratio: ${proposed?.metrics?.highRatio || 'N/A'}
- Low ratio: ${proposed?.metrics?.lowRatio || 'N/A'}

Compatibility Status: ${this.assessCompatibility(userSetup, analysisResults)}
`;

      // Add terrain suitability analysis
      context += this.generateTerrainAnalysis(analysisResults, bikeType);
    }

    return context || "No current setup information available.";
  }

  formatComponent(component) {
    if (!component) return 'Not selected';
    return `${component.model || 'Unknown'} ${component.variant || ''}`.trim();
  }

  assessCompatibility(userSetup, _analysisResults) {
    if (!userSetup?.crankset || !userSetup?.cassette) return 'Cannot assess - incomplete setup';
    
    const warnings = [];
    
    // Check derailleur capacity
    if (userSetup.cassette?.teeth) {
      const cassetteRange = Math.max(...userSetup.cassette.teeth) - Math.min(...userSetup.cassette.teeth);
      if (cassetteRange > 36) {
        warnings.push('Large cassette range may require long-cage derailleur');
      }
    }
    
    // Check speed compatibility
    if (userSetup.crankset?.speeds && userSetup.cassette?.speeds) {
      const cranksetSpeed = this.extractSpeedCount(userSetup.crankset.speeds);
      const cassetteSpeed = this.extractSpeedCount(userSetup.cassette.speeds);
      
      if (cranksetSpeed !== cassetteSpeed && cranksetSpeed !== 0 && cassetteSpeed !== 0) {
        warnings.push(`Speed mismatch: ${cranksetSpeed}-speed crankset with ${cassetteSpeed}-speed cassette`);
      }
    }
    
    return warnings.length > 0 ? `Warnings: ${warnings.join(', ')}` : 'Compatible';
  }

  extractSpeedCount(speedString) {
    if (!speedString) return 0;
    const match = speedString.match(/(\d+)-speed/);
    return match ? parseInt(match[1]) : 0;
  }

  generateTerrainAnalysis(analysisResults, bikeType) {
    const { proposed } = analysisResults;
    if (!proposed?.metrics) return '';
    
    const lowRatio = parseFloat(proposed.metrics.lowRatio);
    const highRatio = parseFloat(proposed.metrics.highRatio);
    
    let analysis = '\nTERRAIN SUITABILITY:\n';
    
    // Climbing analysis
    if (lowRatio < 1.5) {
      analysis += '- Excellent for steep mountain climbs (15%+ grades)\n';
    } else if (lowRatio < 2.0) {
      analysis += '- Good for moderate to steep climbs (8-15% grades)\n';
    } else if (lowRatio < 2.5) {
      analysis += '- Suitable for rolling hills and moderate climbs (5-10% grades)\n';
    } else {
      analysis += '- Best for flat to rolling terrain (0-5% grades)\n';
    }
    
    // Speed analysis
    if (highRatio > 4.5) {
      analysis += '- High top speed capability for racing/fast group rides\n';
    } else if (highRatio > 3.5) {
      analysis += '- Good top speed for recreational riding and touring\n';
    } else {
      analysis += '- Moderate top speed, prioritizes climbing over speed\n';
    }
    
    // Bike type specific insights
    if (bikeType === 'gravel') {
      analysis += '- Setup optimized for mixed terrain and adventure riding\n';
    } else if (bikeType === 'mtb') {
      analysis += '- Configuration suited for technical trail riding\n';
    } else if (bikeType === 'road') {
      analysis += '- Road-focused setup for pavement efficiency\n';
    }
    
    return analysis;
  }

  processResponseForMobile(response) {
    // Add mobile-friendly affiliate buttons
    const buttonsHtml = `
      <div class="flex flex-col gap-3 mt-4 p-4 rounded-lg" style="background: var(--surface-elevated); border: 1px solid var(--border-subtle);">
        <div class="text-sm font-medium" style="color: var(--text-secondary);">Shop Components:</div>
        <div class="grid grid-cols-1 gap-2">
          <a href="https://www.jensonusa.com/?utm_source=cranksmith&utm_medium=riley_chat" 
             target="_blank"
             class="px-4 py-3 rounded-lg font-medium transition-all text-sm flex items-center justify-center gap-2"
             style="background: var(--accent-blue); color: white;">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9"/>
            </svg>
            Jenson USA
          </a>
          <a href="https://www.competitivecyclist.com/?utm_source=cranksmith&utm_medium=riley_chat" 
             target="_blank"
             class="px-4 py-3 rounded-lg font-medium transition-all text-sm flex items-center justify-center gap-2"
             style="background: var(--surface-elevated); color: var(--text-primary); border: 1px solid var(--border-subtle);">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9"/>
            </svg>
            Competitive Cyclist
          </a>
        </div>
      </div>
    `;

    return response + buttonsHtml;
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  // Enhanced quick questions based on context
  getContextualQuestions(_userSetup = null, analysisResults = null, bikeType = null) {
    const baseQuestions = [
      "What's the best upgrade for climbing performance?",
      "Is my current setup compatible?", 
      "How do I reduce chain drop issues?",
      "What's the most cost-effective upgrade?",
      "Should I upgrade cassette or crankset first?",
    ];

    const contextQuestions = [];

    if (bikeType === 'gravel') {
      contextQuestions.push(
        "What tire width should I run for gravel?",
        "1x vs 2x for gravel adventures?",
        "Best components for bikepacking?"
      );
    } else if (bikeType === 'mtb') {
      contextQuestions.push(
        "What's the ideal gear range for trail riding?",
        "Should I go with a larger cassette?",
        "How low should my climbing gear be?"
      );
    } else if (bikeType === 'road') {
      contextQuestions.push(
        "What gear ratios for hill climbs?",
        "Compact vs standard crankset?",
        "Best setup for long rides?"
      );
    }

    if (analysisResults?.comparison?.weightChange > 50) {
      contextQuestions.push("Is this weight increase worth it?");
    }

    if (analysisResults?.comparison?.speedChange > 2) {
      contextQuestions.push("Will I notice this speed difference?");
    }

    return [...baseQuestions, ...contextQuestions].slice(0, 8); // Limit for mobile
  }
}

// Enhanced React Component with better mobile UX
import { useState, useRef, useEffect } from 'react';

export function RileyChat({ userSetup, analysisResults, componentDatabase, bikeType }) {
  const [messages, setMessages] = useState([
    {
      type: 'riley',
      content: getWelcomeMessage(userSetup, analysisResults, bikeType),
      timestamp: new Date().toISOString()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [riley] = useState(new RileyAI(componentDatabase));
  const quickQuestionTimeout = useRef(null);

  // Generate contextual welcome message
  function getWelcomeMessage(setup, results, type) {
    if (results) {
      const speedChange = results.comparison?.speedChange || 0;
      const weightChange = results.comparison?.weightChange || 0;
      
      if (speedChange > 1) {
        return `Hey! I see you're looking at a setup that could give you ${speedChange.toFixed(1)} mph more top speed. That's a solid improvement! What would you like to know about this configuration?`;
      } else if (weightChange < -100) {
        return `Nice! This setup saves you ${Math.abs(weightChange)}g. Every gram counts, especially on climbs. What questions do you have about these components?`;
      } else {
        return `I've analyzed your ${type || ''} bike setup. The gear ratios look interesting! What specific aspects would you like me to explain or optimize?`;
      }
    } else if (setup?.crankset || setup?.cassette) {
      return `I can see you're working on a ${type || ''} bike setup. Need help with compatibility, performance, or choosing the right components?`;
    }
    
    return "Hey there! I'm Riley, your bike tech expert. I can help with component compatibility, gear ratios, upgrade recommendations, or any cycling tech questions. What's on your mind?";
  }

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

    const response = await riley.askRiley(currentMessage, userSetup, analysisResults, bikeType);

    const rileyMessage = {
      type: 'riley',
      content: response.success ? response.response : response.error,
      timestamp: response.timestamp
    };

    setMessages(prev => [...prev, rileyMessage]);
    setIsLoading(false);
  };

  const handleQuickQuestion = (question) => {
    setCurrentMessage(question);
    // Auto-send after brief delay with cleanup
    if (quickQuestionTimeout.current) {
      clearTimeout(quickQuestionTimeout.current);
    }
    quickQuestionTimeout.current = setTimeout(() => {
      sendMessage();
    }, 100);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (quickQuestionTimeout.current) {
        clearTimeout(quickQuestionTimeout.current);
      }
    };
  }, []);

  const quickQuestions = riley.getContextualQuestions(userSetup, analysisResults, bikeType);

  return (
    <div className="card max-w-4xl mx-auto">
      {/* Mobile-optimized header */}
      <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
             style={{ background: 'linear-gradient(135deg, var(--accent-blue) 0%, #5856d6 100%)' }}>
          🔧
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Ask Riley
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            {analysisResults ? 'Analyzing your gear setup' : 'Your bike tech expert'}
          </p>
        </div>
        {analysisResults && (
          <div className="text-xs px-2 py-1 rounded" style={{ background: 'var(--accent-blue)', color: 'white' }}>
            Analysis Ready
          </div>
        )}
      </div>

      {/* Contextual quick questions */}
      <div className="mb-6">
        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Quick questions:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="px-3 py-2 text-sm text-left rounded-lg transition-colors"
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

      {/* Mobile-optimized chat messages */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-lg ${
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
              <div className="text-sm leading-relaxed"
                   dangerouslySetInnerHTML={{ 
                     __html: message.content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="underline">$1</a>')
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

      {/* Mobile-optimized input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about compatibility, performance, upgrades..."
          className="input-field flex-1 text-base"
          style={{ fontSize: '16px' }} // Prevent zoom on iOS
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={!currentMessage.trim() || isLoading}
          className="btn-primary px-4 py-2 min-w-[60px]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </button>
      </div>

      {/* Mobile disclaimer */}
      <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: 'var(--surface-elevated)', color: 'var(--text-tertiary)' }}>
        <strong>💡 Disclaimer:</strong> Riley can make mistakes. Always verify important compatibility and safety info.
      </div>
    </div>
  );
}