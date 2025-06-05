// pages/api/riley.js
export default async function handler(req, res) {
    console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);
    
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const { prompt } = req.body;
  
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01' // Keep this for now
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022', // ← Updated to latest model
          max_tokens: 1024, // ← Increased from 800
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        }),
      });
  
      console.log('Response status:', response.status);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
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
        error: 'Sorry, I\'m having trouble connecting right now. Try asking again in a moment.',
        timestamp: new Date().toISOString()
      });
    }
  }