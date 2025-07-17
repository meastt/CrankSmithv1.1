// pages/api/verify-beta.js
import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  console.log('Beta verification API called');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  console.log('Verifying email:', email);

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    // First, let's see ALL emails in the table for debugging
    console.log('Getting all emails for comparison...');
    const { data: allEmails, error: _allError } = await supabase
      .from('early_access')
      .select('email');
    
    console.log('All emails in database:', allEmails);
    
    // Now try the specific query
    console.log('Checking for specific email...');
    const { data, error } = await supabase
      .from('early_access')
      .select('email, created_at')
      .ilike('email', email.trim());

    if (error) {
      console.log('Supabase error:', error);
      throw error;
    }

    console.log('Specific query returned:', data);

    if (data && data.length > 0) {
      console.log('Email found in database:', data[0]);
      return res.status(200).json({ 
        success: true, 
        hasAccess: true,
        message: 'Welcome to the beta!',
        signupDate: data[0].created_at
      });
    } else {
      console.log('No matching email found');
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