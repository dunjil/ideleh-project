-- Create a table for tasks
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
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

-- Create tables for our application

-- Admin users table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_path TEXT NOT NULL, -- Path to image in Supabase Storage
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  expectation TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  image_path TEXT NOT NULL, -- Path to image in Supabase Storage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  image_url TEXT NOT NULL, -- URL to the image
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin account
INSERT INTO admins (username, password)
VALUES ('admin', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Insert the three team members
INSERT INTO team_members (name, position, bio, image_url)
VALUES 
  ('Abel Ajayi', 'Co-Founder, IDELEH', 'Abel is passionate about developing leadership skills in young people.', 'https://caddxjhrkpqtllulhvjh.supabase.co/storage/v1/object/sign/assets/Abel%20Ajayi%20-%20Headshot.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzcyMzZiYTYwLWM1ZDAtNDc2Ni1hYmNiLTcyMGMwZTgyMzdiNCJ9.eyJ1cmwiOiJhc3NldHMvQWJlbCBBamF5aSAtIEhlYWRzaG90LmpwZyIsImlhdCI6MTc0NTE4OTA0OSwiZXhwIjoyMjE4MjI5MDQ5fQ.GKcAlosRGQNW7IMV7lVZo2mupjFZTzY3G4cJSoKPkl4'),
  ('Priscilla Asher John', 'Co-Founder, Executive Director', 'Priscilla leads our flagship leadership programs with passion and dedication.', 'https://caddxjhrkpqtllulhvjh.supabase.co/storage/v1/object/sign/assets/priscilla.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzcyMzZiYTYwLWM1ZDAtNDc2Ni1hYmNiLTcyMGMwZTgyMzdiNCJ9.eyJ1cmwiOiJhc3NldHMvcHJpc2NpbGxhLmpwZyIsImlhdCI6MTc0NTE4OTExNiwiZXhwIjoyMjE4MjI5MTE2fQ.MdwLCmAqV7IqRXq7Yhdsqy0aqbSe00NGB9Tq7D3SnCc'),
  ('Waltong David Tyoden', 'Co-Founder, IDELEH', 'Waltong builds partnerships with local communities and organizations.', 'https://caddxjhrkpqtllulhvjh.supabase.co/storage/v1/object/sign/assets/waltong.JPEG?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzcyMzZiYTYwLWM1ZDAtNDc2Ni1hYmNiLTcyMGMwZTgyMzdiNCJ9.eyJ1cmwiOiJhc3NldHMvd2FsdG9uZy5KUEVHIiwiaWF0IjoxNzQ1MTg5MTY5LCJleHAiOjIyMTgyMjkxNjl9.mT0FSoemlGRkQBh7CRd7baq0P5b8DR5yIVuUE4hrHhQ');
