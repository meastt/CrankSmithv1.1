// pages/api/early-access.js - FIXED VERSION with Zoho + Supabase
import nodemailer from 'nodemailer';
import { supabase } from '../../lib/supabase';
import { validateRequestBody } from '../../lib/validation';

export default async function handler(req, res) {
  console.log('Early access API called');
  
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
    console.log('Validation errors:', validation.errors);
    return res.status(400).json({ 
      error: validation.errors[0], // Return first error for user-friendly response
      errors: validation.errors // Include all errors for debugging
    });
  }
  
  const { email, source = 'landing_page' } = validation.sanitized;
  console.log('Valid email received:', email);

  try {
    // Save to Supabase
    console.log('Attempting to save to Supabase...');
    const { data, error } = await supabase
      .from('early_access')
      .insert([{ 
        email, 
        source,
        created_at: new Date().toISOString()
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

    console.log('Saved to Supabase successfully:', data);

    // Send email with Zoho
    console.log('Setting up Zoho transporter...');
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
    console.log('Verifying Zoho connection...');
    await transporter.verify();
    console.log('Zoho connection verified');

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
              <h1>Welcome to CrankSmith! 🚴‍♂️</h1>
            </div>
            <div class="content">
              <h2>Hey fellow cyclist! 👋</h2>
              
              <p>Thanks for joining CrankSmith! You're among the first to get access to the most comprehensive bike gear calculator ever built.</p>
              
              <p>I built CrankSmith because I was tired of:</p>
              <ul>
                <li>Guessing if an upgrade would actually help</li>
                <li>Using clunky calculators with generic data</li>
                <li>Wasting money on components that didn't improve my ride</li>
              </ul>
              
              <div class="feature-list">
                <p><strong>🎯 What you get with early access:</strong></p>
                <ul>
                  <li>✅ First access when we officially launch</li>
                  <li>✅ 50% off lifetime discount (just for early supporters)</li>
                  <li>✅ Direct input on new features</li>
                  <li>✅ Access to our beta right now</li>
                </ul>
              </div>
              
              <p style="text-align: center;">
                <a href="https://cranksmith.com?beta=true" class="button">
                  🚀 Access Beta Now
                </a>
              </p>
              
              <p style="text-align: center; color: #666; font-size: 14px;">
                <em>Bookmark this link - it's your secret access!</em>
              </p>
              
              <div class="signature">
                <p>Got questions? Just reply to this email. I personally read every message and usually respond within a day.</p>
                
                <p>
                  Ride on!<br>
                  <strong>Mike</strong><br>
                  Founder, CrankSmith<br>
                  <em style="color: #666;">Fellow bike nerd who spent way too much on the wrong cassette once</em>
                </p>
              </div>
            </div>
            <div class="footer">
              <p>You're receiving this because you signed up at cranksmith.com</p>
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
    console.log('Sending welcome email...');
    const mailOptions = {
      from: `"CrankSmith" <${process.env.ZOHO_EMAIL}>`,
      to: email,
      subject: 'Welcome to CrankSmith! 🚴‍♂️ Your beta access is here',
      html: emailHtml,
      text: `Welcome to CrankSmith!

Thanks for joining! You're among the first to get access to the most comprehensive bike gear calculator ever built.

Access the beta here: https://cranksmith.com?beta=true

What you get with early access:
- First access when we officially launch
- 50% off lifetime discount
- Direct input on new features
- Access to our beta right now

Got questions? Just reply to this email.

Ride on!
Mike
Founder, CrankSmith`
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');

    // Optional: Send yourself a notification
    if (process.env.ADMIN_EMAIL) {
      await transporter.sendMail({
        from: `"CrankSmith" <${process.env.ZOHO_EMAIL}>`,
        to: process.env.ADMIN_EMAIL,
        subject: '🎉 New CrankSmith Beta Signup!',
        text: `New signup: ${email}\n\nTotal signups: Check Supabase dashboard`,
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Welcome aboard! Check your email for beta access.' 
    });
    
  } catch (error) {
    console.error('Early access signup error:', error);
    
    // More specific error messages
    if (error.message?.includes('auth')) {
      console.error('Email auth error - check ZOHO credentials');
    }
    if (error.message?.includes('supabase')) {
      console.error('Supabase error - check connection');
    }
    
    res.status(500).json({ 
      error: 'Failed to process signup. Please try again or email mike@cranksmith.com directly.' 
    });
  }
}