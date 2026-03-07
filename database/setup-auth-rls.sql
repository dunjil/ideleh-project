-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Disable RLS for public tables (for admin access)
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;

-- Enable RLS for the tasks table (for user-specific data)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only see their own tasks
CREATE POLICY "Users can only see their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy for users to insert their own tasks
CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own tasks
CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for users to delete their own tasks
CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Make storage buckets public
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
