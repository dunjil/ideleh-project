-- IDELEH PostgreSQL Schema (self-hosted, no Supabase)
-- Run this file once to set up the database:
--   psql $DATABASE_URL -f schema.sql

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Users (public signup/login) ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_sessions (
  token      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Admin credentials ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admins (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username   TEXT UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default admin (password: admin — change this after first login!)
INSERT INTO admins (username, password)
VALUES ('admin', 'admin')
ON CONFLICT (username) DO NOTHING;

-- ── Site content (mission / vision) ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS site_content (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key        TEXT UNIQUE NOT NULL,
  title      TEXT,
  content    TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_content (key, title, content) VALUES
  ('mission', 'Our Mission', 'To identify young Leaders through a rigorous selection process that assess knowledge base; competence; skills; apt for learning; intuition, relational abilities and character. To raise Credible, Competent and Principled drivers of Effective and Progressive leadership in the Nations of life through strategic and deliberate leadership trainings and mentorship.'),
  ('vision',  'Our Vision',  'High performing Leaders providing the nations with genuine leadership.')
ON CONFLICT (key) DO NOTHING;

-- ── Hero images (slideshow on homepage) ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS hero_images (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  image_data    TEXT,          -- base64 data URI
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Events ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  image_data  TEXT,            -- base64 data URI
  event_date  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Event registrations ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS registrations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name  TEXT NOT NULL,
  gender     TEXT NOT NULL,
  expectation TEXT,
  email      TEXT NOT NULL,
  phone      TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Gallery ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS gallery (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  image_data TEXT,             -- base64 data URI
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Team members ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS team_members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  position   TEXT NOT NULL,
  bio        TEXT,
  image_data TEXT,             -- base64 data URI
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Projects ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  image_data    TEXT,          -- base64 data URI
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
