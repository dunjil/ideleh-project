-- Insert sample projects if none exist
INSERT INTO projects (title, description, image_path, is_featured, display_order)
SELECT 'LeaderZ Conferences', 
       'Redefining the way secondary school prefects are trained, mentored, and empowered to become influential leaders.', 
       'leaderz-conferences.jpg', 
       true, 
       1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'LeaderZ Conferences');

INSERT INTO projects (title, description, image_path, is_featured, display_order)
SELECT 'Nation Building Conferences', 
       'Inspiring aspiring leaders to position themselves with the requisite knowledge, skills, and values to address unique challenges.', 
       'nation-building.jpg', 
       true, 
       2
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Nation Building Conferences');

INSERT INTO projects (title, description, image_path, is_featured, display_order)
SELECT 'Mentorship Hub', 
       'Connecting aspiring leaders with experienced mentors who provide guidance, support, and valuable insights.', 
       'mentorship-hub.jpg', 
       true, 
       3
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Mentorship Hub');

-- Make sure team members exist
SELECT COUNT(*) FROM team_members;
