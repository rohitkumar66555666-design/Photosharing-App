# Supabase Setup Instructions

## 1. Create a Supabase Project
- Go to https://supabase.com
- Create a new project
- Note your project URL and anon key

## 2. Update Configuration
Edit `src/lib/supabase.ts` and replace:
- `YOUR_SUPABASE_URL` with your project URL
- `YOUR_SUPABASE_ANON_KEY` with your anon key

## 3. Create Database Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Create events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create photos table
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now - adjust based on your auth needs)
CREATE POLICY "Allow all operations on events" ON events FOR ALL USING (true);
CREATE POLICY "Allow all operations on photos" ON photos FOR ALL USING (true);
```

## 4. Create Storage Bucket

1. Go to Storage in Supabase dashboard
2. Create a new bucket named `event-photos`
3. Make it public
4. Set the following policy:

```sql
CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'event-photos');
CREATE POLICY "Allow public access" ON storage.objects FOR SELECT USING (bucket_id = 'event-photos');
```

## 5. Run the App

```bash
npm start
```

Press 'a' for Android or 'i' for iOS
