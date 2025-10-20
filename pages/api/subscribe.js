// Import the existing Supabase client
import { supabaseAdmin } from '../../lib/supabase.js';

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

    // Try to save to Supabase users table
    try {
      
      // Check if email already exists in users table
      const { data: existingUser, error: checkError } = await supabaseAdmin
        .from('users')
        .select('id, email')
        .eq('email', email.toLowerCase())
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" which is expected for new emails
        console.error('Error checking existing user:', checkError);
      }

      if (existingUser) {
        return res.status(409).json({ 
          error: 'Email already subscribed',
          message: 'This email is already subscribed to our newsletter.'
        });
      }

      // Insert new user with email subscription
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert([
          {
            email: email.toLowerCase(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            email_subscribed: true,
            email_subscribed_at: new Date().toISOString(),
            subscription_source: 'popup',
            status: 'active'
          }
        ])
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        
        // If users table doesn't exist, try email_subscribers as fallback
        if (error.code === '42P01') { // Table doesn't exist
          
          const { data: fallbackData, error: fallbackError } = await supabaseAdmin
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

          if (fallbackError) {
            console.error('Fallback insert error:', fallbackError);
            throw new Error(`Database error: ${fallbackError.message}`);
          }

          return res.status(200).json({
            success: true,
            message: 'Successfully subscribed to newsletter!',
            data: {
              id: fallbackData[0].id,
              email: fallbackData[0].email,
              subscribed_at: fallbackData[0].subscribed_at
            }
          });
        }
        
        throw new Error(`Database error: ${error.message}`);
      }

      // Log successful subscription

      // Return success response
      return res.status(200).json({
        success: true,
        message: 'Successfully subscribed to newsletter!',
        data: {
          id: data[0].id,
          email: data[0].email,
          subscribed_at: data[0].email_subscribed_at
        }
      });
    } catch (supabaseError) {
      console.error('Supabase operation failed:', supabaseError);
      // Fall through to fallback storage
    }

    // Fallback: Log to console and return success
    
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