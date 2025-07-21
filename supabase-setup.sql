-- Create users table for CrankSmith user management and email collection
-- Run this in your Supabase SQL editor

-- Create the users table (primary table for email collection)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email_subscribed BOOLEAN DEFAULT false,
  email_subscribed_at TIMESTAMP WITH TIME ZONE,
  subscription_source VARCHAR(50) DEFAULT 'popup',
  status VARCHAR(20) DEFAULT 'active',
  -- Add any other user fields you might need
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  preferences JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_email_subscribed ON users(email_subscribed);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Enable Row Level Security (RLS) for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to manage users
CREATE POLICY "Service role can manage users" ON users
  FOR ALL USING (auth.role() = 'service_role');

-- Create policy to allow users to view their own data (if needed)
-- CREATE POLICY "Users can view their own data" ON users
--   FOR SELECT USING (auth.uid() IS NOT NULL);

-- Create email_subscribers table as fallback (legacy support)
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source VARCHAR(50) DEFAULT 'popup',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for email_subscribers table
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_status ON email_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_subscribed_at ON email_subscribers(subscribed_at);

-- Enable Row Level Security (RLS) for email_subscribers table
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to manage email subscribers
CREATE POLICY "Service role can manage email subscribers" ON email_subscribers
  FOR ALL USING (auth.role() = 'service_role');

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_subscribers_updated_at 
  BEFORE UPDATE ON email_subscribers 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO service_role;
GRANT ALL ON email_subscribers TO authenticated;
GRANT ALL ON email_subscribers TO service_role;

-- Create a view for email subscription analytics
CREATE OR REPLACE VIEW email_subscription_analytics AS
SELECT 
  'users' as table_name,
  DATE(created_at) as subscription_date,
  subscription_source as source,
  status,
  COUNT(*) as subscriber_count
FROM users
WHERE email_subscribed = true
GROUP BY DATE(created_at), subscription_source, status

UNION ALL

SELECT 
  'email_subscribers' as table_name,
  DATE(subscribed_at) as subscription_date,
  source,
  status,
  COUNT(*) as subscriber_count
FROM email_subscribers
GROUP BY DATE(subscribed_at), source, status
ORDER BY subscription_date DESC;

-- Grant permissions on the view
GRANT SELECT ON email_subscription_analytics TO authenticated;
GRANT SELECT ON email_subscription_analytics TO service_role;

-- Optional: Create a function to migrate data from email_subscribers to users
CREATE OR REPLACE FUNCTION migrate_email_subscribers_to_users()
RETURNS INTEGER AS $$
DECLARE
  migrated_count INTEGER := 0;
BEGIN
  INSERT INTO users (email, email_subscribed, email_subscribed_at, subscription_source, status, created_at, updated_at)
  SELECT 
    es.email,
    true,
    es.subscribed_at,
    es.source,
    es.status,
    es.created_at,
    es.updated_at
  FROM email_subscribers es
  WHERE NOT EXISTS (
    SELECT 1 FROM users u WHERE u.email = es.email
  );
  
  GET DIAGNOSTICS migrated_count = ROW_COUNT;
  RETURN migrated_count;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on the migration function
GRANT EXECUTE ON FUNCTION migrate_email_subscribers_to_users() TO service_role;