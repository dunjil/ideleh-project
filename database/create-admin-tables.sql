-- Create hero_images table for the slideshow
CREATE TABLE IF NOT EXISTS hero_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_path TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  image_path TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site_content table for editable content like mission/vision
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default mission and vision statements
INSERT INTO site_content (key, title, content)
VALUES 
  ('mission', 'Our Mission', 'To identify young Leaders through a rigorous selection process that assess knowledge base; competence; skills; apt for learning; intuition, relational abilities and character. To raise Credible, Competent and Principled drivers of Effective and Progressive leadership in the Nations of life through strategic and deliberate leadership trainings and mentorship.')
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_content (key, title, content)
VALUES 
  ('vision', 'Our Vision', 'High performing Leaders providing the nations with genuine leadership.')
ON CONFLICT (key) DO NOTHING;

-- Disable RLS for these tables
ALTER TABLE hero_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_content DISABLE ROW LEVEL SECURITY;

-- Create assets bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create storage policies for assets bucket
CREATE POLICY "Allow public access to assets bucket" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'assets');

CREATE POLICY "Allow insert to assets bucket" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'assets');

CREATE POLICY "Allow update to assets bucket" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'assets');

CREATE POLICY "Allow delete from assets bucket" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'assets');
