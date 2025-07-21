-- Create email_subscribers table for CrankSmith email collection
-- Run this in your Supabase SQL editor

-- Create the table
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source VARCHAR(50) DEFAULT 'popup',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_email_subscribers_status ON email_subscribers(status);

-- Create index for date range queries
CREATE INDEX IF NOT EXISTS idx_email_subscribers_subscribed_at ON email_subscribers(subscribed_at);

-- Enable Row Level Security (RLS)
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read their own data (if needed)
-- CREATE POLICY "Users can view their own email subscription" ON email_subscribers
--   FOR SELECT USING (auth.uid() IS NOT NULL);

-- Create policy to allow service role to insert/update/delete
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

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_email_subscribers_updated_at 
  BEFORE UPDATE ON email_subscribers 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON email_subscribers TO authenticated;
GRANT ALL ON email_subscribers TO service_role;

-- Optional: Create a view for analytics
CREATE OR REPLACE VIEW email_subscribers_analytics AS
SELECT 
  DATE(subscribed_at) as subscription_date,
  source,
  status,
  COUNT(*) as subscriber_count
FROM email_subscribers
GROUP BY DATE(subscribed_at), source, status
ORDER BY subscription_date DESC;

-- Grant permissions on the view
GRANT SELECT ON email_subscribers_analytics TO authenticated;
GRANT SELECT ON email_subscribers_analytics TO service_role;