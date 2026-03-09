-- ============================================
-- COLLABORATIVE FEATURES SQL SCRIPT
-- Run this in Supabase SQL Editor
-- ============================================

-- Create event_members table for collaborative albums
CREATE TABLE IF NOT EXISTS event_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  role TEXT DEFAULT 'contributor', -- 'owner', 'contributor', 'viewer'
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_name)
);

-- Disable RLS for easier access (for development)
ALTER TABLE event_members DISABLE ROW LEVEL SECURITY;

-- Add access_code to events table for easy joining
ALTER TABLE events ADD COLUMN IF NOT EXISTS access_code TEXT UNIQUE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;
ALTER TABLE events ADD COLUMN IF NOT EXISTS allow_contributions BOOLEAN DEFAULT true;

-- Create function to generate random access code
CREATE OR REPLACE FUNCTION generate_access_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Update existing events to have access codes
UPDATE events SET access_code = generate_access_code() WHERE access_code IS NULL;

-- Create trigger to auto-generate access code for new events
CREATE OR REPLACE FUNCTION set_access_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.access_code IS NULL THEN
    NEW.access_code := generate_access_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_access_code ON events;
CREATE TRIGGER trigger_set_access_code
BEFORE INSERT ON events
FOR EACH ROW
EXECUTE FUNCTION set_access_code();

-- Done! Collaborative features are now enabled.
