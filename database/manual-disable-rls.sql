-- This script disables Row Level Security for all admin tables
-- Run this in the Supabase SQL Editor if you're having RLS issues

-- Disable RLS for all public tables used by the admin dashboard
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Make storage buckets public for admin access
INSERT INTO storage.buckets (id, name, public) VALUES ('events', 'events', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create a function that can be used to execute SQL from the client
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
