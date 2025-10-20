// pages/api/verify-beta.js
import { supabaseAdmin } from '../../lib/supabase';

export default async function handler(req, res) {
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    // First, let's see ALL emails in the users table for debugging
    const { data: allEmails, error: allError } = await supabaseAdmin
      .from('users')
      .select('email');
    
    
    // Now try the specific query
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('email, created_at, email_subscribed')
      .ilike('email', email.trim());

    if (error) {
      throw error;
    }


    if (data && data.length > 0) {
      return res.status(200).json({ 
        success: true, 
        hasAccess: true,
        message: 'Welcome to the beta!',
        signupDate: data[0].created_at
      });
    } else {
      return res.status(200).json({ 
        success: true, 
        hasAccess: false,
        message: 'Email not found in beta list' 
      });
    }

  } catch (error) {
    console.error('Beta verification error:', error);
    return res.status(500).json({ 
      error: 'Verification failed' 
    });
  }
}