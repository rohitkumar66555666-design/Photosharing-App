-- ============================================
-- COMPLETE SUPABASE FIX SCRIPT
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- Step 1: Disable Row Level Security on tables
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE photos DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop any existing policies (if they exist)
DROP POLICY IF EXISTS "Allow all operations on events" ON events;
DROP POLICY IF EXISTS "Allow all operations on photos" ON photos;
DROP POLICY IF EXISTS "Enable all access for events" ON events;
DROP POLICY IF EXISTS "Enable all access for photos" ON photos;

-- Step 3: Fix storage policies
-- Drop existing storage policies if any
DROP POLICY IF EXISTS "Allow public uploads to event-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads from event-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to event-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes from event-photos" ON storage.objects;

-- Step 4: Create new storage policies that work
CREATE POLICY "Allow public uploads to event-photos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'event-photos');

CREATE POLICY "Allow public reads from event-photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-photos');

CREATE POLICY "Allow public updates to event-photos"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'event-photos')
WITH CHECK (bucket_id = 'event-photos');

CREATE POLICY "Allow public deletes from event-photos"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'event-photos');

-- Done! Your database is now configured correctly.
