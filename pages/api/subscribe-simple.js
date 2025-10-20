// Simple email collection API that works with existing users table structure
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

    
    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing user:', checkError);
      // Don't fail the request if we can't check for existing user
    }

    if (existingUser) {
      return res.status(200).json({ 
        success: true,
        message: 'Email already registered! Thanks for your interest.'
      });
    }

    // Insert new user with minimal required fields
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          email: email.toLowerCase(),
          role: 'subscriber', // Use existing role field
          preferences: {
            email_subscribed: true,
            subscription_source: 'popup',
            subscribed_at: new Date().toISOString()
          }
        }
      ])
      .select();

    if (error) {
      console.error('Insert error:', error);
      
      // Handle duplicate email error gracefully
      if (error.code === '23505') {
        return res.status(200).json({
          success: true,
          message: 'Email already registered! Thanks for your interest.'
        });
      }
      
      throw new Error(`Database error: ${error.message}`);
    }


    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data: {
        id: data[0].id,
        email: data[0].email,
        subscribed_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Subscription error:', error);
    
    // More specific error responses
    if (error.message.includes('Invalid email')) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please enter a valid email address.'
      });
    }
    
    if (error.message.includes('Database error')) {
      return res.status(503).json({
        error: 'Database temporarily unavailable',
        message: 'Please try again in a moment.'
      });
    }
    
    return res.status(500).json({
      error: 'Internal server error',
      message: 'There was an error processing your request. Please try again later.'
    });
  }
} 