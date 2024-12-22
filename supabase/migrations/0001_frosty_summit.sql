/*
  # Initial Schema Setup for Family Memories

  1. New Tables
    - `photos`
      - `id` (uuid, primary key)
      - `url` (text)
      - `caption` (text)
      - `created_by` (text)
      - `created_at` (timestamp)
      - `album_id` (uuid, foreign key)
    
    - `albums`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_by` (text)
      - `created_at` (timestamp)
    
    - `memories`
      - `id` (uuid, primary key)
      - `content` (text)
      - `created_by` (text)
      - `created_at` (timestamp)
    
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `date` (timestamp)
      - `created_by` (text)
      - `created_at` (timestamp)
    
    - `family_members`
      - `id` (uuid, primary key)
      - `name` (text)
      - `bio` (text)
      - `photo_url` (text)
      - `birth_date` (date)
      - `parent_ids` (uuid[])
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
*/

-- Create albums table
CREATE TABLE albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON albums FOR SELECT USING (true);
CREATE POLICY "Allow insert with creator name" ON albums FOR INSERT WITH CHECK (created_by IS NOT NULL);

-- Create photos table
CREATE TABLE photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  caption text,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  album_id uuid REFERENCES albums(id)
);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON photos FOR SELECT USING (true);
CREATE POLICY "Allow insert with creator name" ON photos FOR INSERT WITH CHECK (created_by IS NOT NULL);

-- Create memories table
CREATE TABLE memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON memories FOR SELECT USING (true);
CREATE POLICY "Allow insert with creator name" ON memories FOR INSERT WITH CHECK (created_by IS NOT NULL);

-- Create events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date timestamptz NOT NULL,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON events FOR SELECT USING (true);
CREATE POLICY "Allow insert with creator name" ON events FOR INSERT WITH CHECK (created_by IS NOT NULL);

-- Create family_members table
CREATE TABLE family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  bio text,
  photo_url text,
  birth_date date,
  parent_ids uuid[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON family_members FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON family_members FOR INSERT WITH CHECK (true);