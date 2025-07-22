// pages/api/early-access.js - Community signup with Zoho + Supabase
import nodemailer from 'nodemailer';
import { supabaseAdmin } from '../../lib/supabase';
import { validateRequestBody } from '../../lib/validation';

// At the top of the file, add development check utility
const isDevelopment = process.env.NODE_ENV === 'development';
const devLog = (...args) => isDevelopment && console.log(...args);

export default async function handler(req, res) {
  devLog('Community signup API called');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate request body with comprehensive validation
  const validationSchema = {
    email: { type: 'email', required: true },
    source: { type: 'string', maxLength: 50 }
  };
  
  const validation = validateRequestBody(req.body, validationSchema);
  
  if (!validation.isValid) {
    devLog('Validation errors:', validation.errors);
    return res.status(400).json({ 
      success: false, 
      error: 'Validation failed',
      details: validation.errors 
    });
  }
  
  const { email, source = 'landing_page' } = validation.sanitized;
  devLog('Valid email received:', email);

  try {
    devLog('Attempting to save to Supabase users table...');
    
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
      return res.status(200).json({ 
        success: true, 
        message: 'You\'re already on the list!' 
      });
    }

    // Insert new user with email subscription
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([{ 
        email: email.toLowerCase(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_subscribed: true,
        email_subscribed_at: new Date().toISOString(),
        subscription_source: source,
        status: 'active'
      }])
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

    devLog('Saved to Supabase successfully:', data);

    // Send email with Zoho
    devLog('Setting up Zoho transporter...');
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.ZOHO_EMAIL, // your-email@yourdomain.com
        pass: process.env.ZOHO_PASSWORD // your zoho password or app-specific password
      }
    });

    // Verify transporter
    devLog('Verifying Zoho connection...');
    await transporter.verify();
    devLog('Zoho connection verified');

    // Email HTML template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              margin: 0;
              padding: 0;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: #ffffff;
            }
            .header { 
              background: linear-gradient(135deg, #ff6b35 0%, #f7931e 25%, #007aff 100%); 
              color: white; 
              padding: 40px 30px; 
              text-align: center; 
            }
            .header h1 {
              margin: 0;
              font-size: 32px;
              font-weight: 700;
            }
            .content { 
              padding: 40px 30px; 
              background: #ffffff;
            }
            .content h2 {
              color: #1a1a1a;
              margin-top: 0;
            }
            .button { 
              display: inline-block; 
              padding: 14px 32px; 
              background: linear-gradient(135deg, #007aff 0%, #5856d6 100%); 
              color: white; 
              text-decoration: none; 
              border-radius: 30px; 
              margin: 20px 0; 
              font-weight: 600;
              font-size: 16px;
            }
            .feature-list {
              background: #f8f9fa;
              border-radius: 12px;
              padding: 20px;
              margin: 20px 0;
            }
            .feature-list li {
              margin: 10px 0;
            }
            .footer { 
              text-align: center; 
              padding: 30px; 
              color: #666; 
              font-size: 14px;
              background: #f8f9fa;
            }
            .signature {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to the CrankSmith community! 🚴‍♂️</h1>
            </div>
            <div class="content">
              <h2>Hey fellow cyclist! 👋</h2>
              
              <p>Thanks for joining our community! CrankSmith is a completely free bike gear calculator and compatibility checker that you can start using right away.</p>
              
              <p>I built CrankSmith because I was tired of:</p>
              <ul>
                <li>Guessing if an upgrade would actually help</li>
                <li>Using clunky calculators with generic data</li>
                <li>Wasting money on components that didn't improve my ride</li>
              </ul>
              
              <div class="feature-list">
                <p><strong>🎯 What's included (completely free):</strong></p>
                <ul>
                  <li>✅ Professional gear ratio calculator</li>
                  <li>✅ Component compatibility checker</li>
                  <li>✅ Tire pressure calculator</li>
                  <li>✅ Performance optimization tools</li>
                  <li>✅ Works offline on your phone</li>
                </ul>
              </div>
              
              <p style="text-align: center;">
                <a href="https://cranksmith.com/calculator" class="button">
                  🚀 Start Using CrankSmith
                </a>
              </p>
              
              <p style="text-align: center; color: #666; font-size: 14px;">
                <em>No signup required - bookmark it for easy access!</em>
              </p>
              
              <div class="signature">
                <p>By joining our community, you'll get occasional updates about new features, cycling tips, and useful content. Got questions? Just reply to this email. I personally read every message and usually respond within a day.</p>
                
                <p>
                  Ride on!<br>
                  <strong>Mike</strong><br>
                  Founder, CrankSmith<br>
                  <em style="color: #666;">Fellow bike nerd who spent way too much on the wrong cassette once</em>
                </p>
              </div>
            </div>
            <div class="footer">
              <p>You're receiving this because you signed up for community updates at cranksmith.com</p>
              <p>
                <a href="https://cranksmith.com" style="color: #007aff; text-decoration: none;">CrankSmith</a> | 
                Built with ❤️ by cyclists, for cyclists
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    devLog('Sending welcome email...');
    const mailOptions = {
      from: `"CrankSmith" <${process.env.ZOHO_EMAIL}>`,
      to: email,
      subject: 'Welcome to the CrankSmith community! 🚴‍♂️',
      html: emailHtml,
      text: `Welcome to the CrankSmith community!

Thanks for joining! CrankSmith is a completely free bike gear calculator and compatibility checker that you can start using right away.

Start using CrankSmith: https://cranksmith.com/calculator

What's included (completely free):
- Professional gear ratio calculator
- Component compatibility checker  
- Tire pressure calculator
- Performance optimization tools
- Works offline on your phone

By joining our community, you'll get occasional updates about new features, cycling tips, and useful content. Got questions? Just reply to this email.

Ride on!
Mike
Founder, CrankSmith`
    };

    await transporter.sendMail(mailOptions);
    devLog('Welcome email sent successfully');

    // Optional: Send yourself a notification
    if (process.env.ADMIN_EMAIL) {
      await transporter.sendMail({
        from: `"CrankSmith" <${process.env.ZOHO_EMAIL}>`,
        to: process.env.ADMIN_EMAIL,
        subject: '🎉 New CrankSmith Community Member!',
        text: `New community signup: ${email}\n\nTotal signups: Check Supabase dashboard`,
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Welcome to the community! Check your email and start using the free tools right away.' 
    });
    
  } catch (error) {
    console.error('Community signup error:', error); // Keep error logging
    
    // More specific error messages
    if (error.message?.includes('auth')) {
      console.error('Email auth error - check ZOHO credentials'); // Keep error logging
      return res.status(500).json({ success: false, error: 'Email service configuration error' });
    }
    if (error.message?.includes('supabase') || error.code) {
      console.error('Supabase error - check connection'); // Keep error logging
      return res.status(500).json({ success: false, error: 'Database connection error' });
    }
    
    res.status(500).json({ 
      error: 'Failed to process signup. Please try again or email mike@cranksmith.com directly.' 
    });
  }
}