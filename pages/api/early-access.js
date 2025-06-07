// pages/api/early-access.js
import nodemailer from 'nodemailer';
import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    // Save to Supabase
    const { data, error } = await supabase
      .from('early_access')
      .insert([{ email, source: 'landing_page' }])
      .select()
      .single();

    if (error) {
      // If email already exists, that's ok
      if (error.code === '23505') {
        return res.status(200).json({ 
          success: true, 
          message: 'You\'re already on the list!' 
        });
      }
      throw error;
    }

    // Create Zoho SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.ZOHO_EMAIL || 'mike@cranksmith.com',
        pass: process.env.ZOHO_PASSWORD // You'll need to set this in Vercel
      }
    });

    // Send notification to yourself
    await transporter.sendMail({
      from: 'mike@cranksmith.com',
      to: 'mike@cranksmith.com',
      subject: '🚀 New CrankSmith Early Access Signup!',
      html: `
        <h2>New signup for CrankSmith!</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Source:</strong> Landing Page</p>
        <hr>
        <p>Total signups will be shown here once we add counting.</p>
      `
    });

    // Send welcome email to the user
    await transporter.sendMail({
      from: 'mike@cranksmith.com',
      to: email,
      subject: 'Welcome to CrankSmith! 🚴‍♂️',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #FF6B35;">Welcome to CrankSmith!</h1>
          
          <p>Thanks for joining our early access list! You're one of the first to experience the future of bike optimization.</p>
          
          <h2>What happens next?</h2>
          <ul>
            <li>🚀 Beta launches in 7 days</li>
            <li>🎯 You'll get first access (100% free during beta)</li>
            <li>📧 I'll personally send updates on new features</li>
            <li>🔧 Your feedback will shape the product</li>
          </ul>
          
          <p><strong>Quick favor?</strong> Reply and tell me: What's the #1 thing you want to optimize on your bike?</p>
          
          <p>Can't wait to help you find your perfect setup!</p>
          
          <p>Ride on,<br>
          Mike<br>
          Founder, CrankSmith</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          
          <p style="color: #666; font-size: 14px;">
            CrankSmith - Stop guessing. Start optimizing.<br>
            <a href="https://cranksmith.com" style="color: #FF6B35;">cranksmith.com</a>
          </p>
        </div>
      `
    });

    console.log(`New early access signup: ${email}`);
    
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