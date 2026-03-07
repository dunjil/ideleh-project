-- Disable RLS for the events table (for demo purposes)
ALTER TABLE events DISABLE ROW LEVEL SECURITY;

-- Disable RLS for the registrations table
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- Disable RLS for the gallery table
ALTER TABLE gallery DISABLE ROW LEVEL SECURITY;

-- Disable RLS for the team_members table
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;

-- Alternatively, if you want to keep RLS enabled but allow all operations:
-- CREATE POLICY "Allow all operations for events" ON events USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all operations for registrations" ON registrations USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all operations for gallery" ON gallery USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all operations for team_members" ON team_members USING (true) WITH CHECK (true);

-- For storage buckets, we need to allow access
INSERT INTO storage.buckets (id, name, public) VALUES ('events', 'events', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create storage policies to allow public access to the buckets
CREATE POLICY "Allow public access to events bucket" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'events');

CREATE POLICY "Allow insert to events bucket" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'events');

CREATE POLICY "Allow update to events bucket" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'events');

CREATE POLICY "Allow delete from events bucket" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'events');

CREATE POLICY "Allow public access to gallery bucket" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'gallery');

CREATE POLICY "Allow insert to gallery bucket" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Allow update to gallery bucket" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'gallery');

CREATE POLICY "Allow delete from gallery bucket" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'gallery');
