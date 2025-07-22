-- Migration to add email subscription columns to existing users table
-- Run this in your Supabase SQL Editor

-- Add missing columns for email subscription functionality
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_subscribed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email_subscribed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_source VARCHAR(50) DEFAULT 'popup',
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email_subscribed ON users(email_subscribed);
CREATE INDEX IF NOT EXISTS idx_users_subscription_source ON users(subscription_source);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_users_updated_at_trigger ON users;
CREATE TRIGGER update_users_updated_at_trigger 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_users_updated_at();

-- Optional: Update existing users to be email subscribed if they have an email
UPDATE users 
SET email_subscribed = true, 
    email_subscribed_at = created_at,
    subscription_source = 'existing_user'
WHERE email IS NOT NULL AND email_subscribed IS NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position; 