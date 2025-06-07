// pages/api/early-access.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    // Store email in a simple JSON file for now (upgrade to database later)
    const fs = require('fs').promises;
    const path = require('path');
    const filePath = path.join(process.cwd(), 'data', 'early-access.json');
    
    // Ensure directory exists
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
    
    // Read existing emails
    let emails = [];
    try {
      const data = await fs.readFile(filePath, 'utf8');
      emails = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, that's ok
    }
    
    // Add new email with timestamp
    emails.push({
      email,
      timestamp: new Date().toISOString(),
      source: 'landing_page'
    });
    
    // Save updated list
    await fs.writeFile(filePath, JSON.stringify(emails, null, 2));
    
    // Send notification email to yourself using Zoho SMTP
    // For now, we'll skip the email setup - you can add it later
    // Just log it for now
    console.log(`New early access signup: ${email}`);
    
    // Send welcome email to the user (implement this with Zoho SMTP later)
    // For beta, just store the emails
    
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