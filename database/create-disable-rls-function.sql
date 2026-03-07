-- Create a function to disable RLS for a table
CREATE OR REPLACE FUNCTION disable_rls(table_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', table_name);
END;
$$;

-- Grant execute permission to the anon role
GRANT EXECUTE ON FUNCTION disable_rls TO anon;
