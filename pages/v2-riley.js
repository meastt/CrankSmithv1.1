export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { chainring, cassette, wheelSize } = req.body;

    // Input validation
    if (!chainring || !cassette || !wheelSize) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // TODO: Implement V2 Riley calculations
    const result = {
      message: 'V2 Riley calculations coming soon',
      input: { chainring, cassette, wheelSize }
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in v2-riley API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 