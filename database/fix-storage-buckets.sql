-- This script specifically fixes storage bucket permissions
-- It creates the buckets if they don't exist and sets up all necessary policies

-- First, make sure the buckets exist and are public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('events', 'events', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public access to events bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow insert to events bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow update to events bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete from events bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to gallery bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow insert to gallery bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow update to gallery bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete from gallery bucket" ON storage.objects;

-- Create unrestricted policies for the events bucket
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

-- Create unrestricted policies for the gallery bucket
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

-- Enable RLS on storage.objects (it should be enabled by default, but just to be sure)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
