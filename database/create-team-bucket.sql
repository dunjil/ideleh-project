-- Check if the team bucket exists and create it if it doesn't
DO $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  -- Check if the bucket exists
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'team'
  ) INTO bucket_exists;
  
  -- Create the bucket if it doesn't exist
  IF NOT bucket_exists THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('team', 'team', true);
    
    -- Add a policy to allow public access to the bucket
    INSERT INTO storage.policies (name, definition, bucket_id)
    VALUES (
      'Public Access',
      '(bucket_id = ''team''::text)',
      'team'
    );
  END IF;
END $$;
