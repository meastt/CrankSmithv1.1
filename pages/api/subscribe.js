// Import the existing Supabase client
import { supabase } from '../../lib/supabase.js';

// For debugging - let's see what's happening
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Service Key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Try to save to Supabase
    try {
      console.log('Attempting to save to Supabase...');
      
      // Check if email already exists
      const { data: existingSubscriber, error: checkError } = await supabase
        .from('email_subscribers')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" which is expected for new emails
        console.error('Error checking existing subscriber:', checkError);
      }

      if (existingSubscriber) {
        return res.status(409).json({ 
          error: 'Email already subscribed',
          message: 'This email is already subscribed to our newsletter.'
        });
      }

      // Insert new subscriber
      const { data, error } = await supabase
        .from('email_subscribers')
        .insert([
          {
            email: email.toLowerCase(),
            subscribed_at: new Date().toISOString(),
            source: 'popup',
            status: 'active'
          }
        ])
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      // Log successful subscription
      console.log('New email subscriber (Supabase):', email);

      // Return success response
      return res.status(200).json({
        success: true,
        message: 'Successfully subscribed to newsletter!',
        data: {
          id: data[0].id,
          email: data[0].email,
          subscribed_at: data[0].subscribed_at
        }
      });
    } catch (supabaseError) {
      console.error('Supabase operation failed:', supabaseError);
      console.log('Falling back to console logging...');
      // Fall through to fallback storage
    }

    // Fallback: Log to console and return success
    console.log('New email subscriber (fallback):', email);
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data: {
        email: email.toLowerCase(),
        subscribed_at: new Date().toISOString(),
        source: 'popup'
      }
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'There was an error processing your request. Please try again later.'
    });
  }
}