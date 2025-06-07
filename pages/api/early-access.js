// pages/api/early-access.js
import nodemailer from 'nodemailer';
import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  console.log('Early access API called');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  console.log('Email received:', email);

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    // Debug: Check if Supabase is configured
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Has Supabase Key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    // Save to Supabase
    console.log('Attempting to save to Supabase...');
    const { data, error } = await supabase
      .from('early_access')
      .insert([{ email, source: 'landing_page' }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      // If email already exists, that's ok
      if (error.code === '23505') {
        return res.status(200).json({ 
          success: true, 
          message: 'You\'re already on the list!' 
        });
      }
      throw error;
    }

    console.log('Saved to Supabase successfully:', data);

    // Skip email sending for now to isolate the issue
    console.log('Skipping email send for debugging...');
    
    res.status(200).json({ 
      success: true, 
      message: 'Successfully joined the waitlist!' 
    });
    
  } catch (error) {
    console.error('Early access signup error:', error);
    res.status(500).json({ 
      error: 'Failed to process signup. Please email mike@cranksmith.com directly.' 
    });
  }
}