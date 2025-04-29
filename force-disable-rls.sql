-- This script forcefully disables RLS for all tables in the public schema
-- It also creates helper functions for admin operations

-- First, create a function to execute SQL with elevated privileges
CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;

-- Grant execute permission to the anon role
GRANT EXECUTE ON FUNCTION exec_sql TO anon;

-- Create a function to disable RLS for a specific table
CREATE OR REPLACE FUNCTION disable_rls_for_table(table_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', table_name);
END;
$$;

-- Grant execute permission to the anon role
GRANT EXECUTE ON FUNCTION disable_rls_for_table TO anon;

-- Create a function to bypass RLS for admin operations
CREATE OR REPLACE FUNCTION admin_insert(
  table_name text,
  data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  EXECUTE format('INSERT INTO %I SELECT * FROM jsonb_populate_record(null::%I, $1) RETURNING to_jsonb(%I.*)', 
                 table_name, table_name, table_name)
  INTO result
  USING data;
  
  RETURN result;
END;
$$;

-- Grant execute permission to the anon role
GRANT EXECUTE ON FUNCTION admin_insert TO anon;

-- Disable RLS for all tables in the public schema
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
  LOOP
    EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', r.tablename);
    RAISE NOTICE 'Disabled RLS for table: %', r.tablename;
  END LOOP;
END;
$$;

-- Make storage buckets public
INSERT INTO storage.buckets (id, name, public) VALUES ('events', 'events', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create policies for storage buckets
DO $$
BEGIN
  -- Drop existing policies if they exist
  BEGIN
    EXECUTE 'DROP POLICY IF EXISTS "Allow public access to events bucket" ON storage.objects';
  EXCEPTION WHEN OTHERS THEN
    -- Policy doesn't exist, continue
  END;
  
  BEGIN
    EXECUTE 'DROP POLICY IF EXISTS "Allow insert to events bucket" ON storage.objects';
  EXCEPTION WHEN OTHERS THEN
    -- Policy doesn't exist, continue
  END;
  
  BEGIN
    EXECUTE 'DROP POLICY IF EXISTS "Allow update to events bucket" ON storage.objects';
  EXCEPTION WHEN OTHERS THEN
    -- Policy doesn't exist, continue
  END;
  
  BEGIN
    EXECUTE 'DROP POLICY IF EXISTS "Allow delete from events bucket" ON storage.objects';
  EXCEPTION WHEN OTHERS THEN
    -- Policy doesn't exist, continue
  END;
  
  BEGIN
    EXECUTE 'DROP POLICY IF EXISTS "Allow public access to gallery bucket" ON storage.objects';
  EXCEPTION WHEN OTHERS THEN
    -- Policy doesn't exist, continue
  END;
  
  BEGIN
    EXECUTE 'DROP POLICY IF EXISTS "Allow insert to gallery bucket" ON storage.objects';
  EXCEPTION WHEN OTHERS THEN
    -- Policy doesn't exist, continue
  END;
  
  BEGIN
    EXECUTE 'DROP POLICY IF EXISTS "Allow update to gallery bucket" ON storage.objects';
  EXCEPTION WHEN OTHERS THEN
    -- Policy doesn't exist, continue
  END;
  
  BEGIN
    EXECUTE 'DROP POLICY IF EXISTS "Allow delete from gallery bucket" ON storage.objects';
  EXCEPTION WHEN OTHERS THEN
    -- Policy doesn't exist, continue
  END;
END;
$$;

-- Create new policies
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
