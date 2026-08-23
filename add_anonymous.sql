-- Add username and is_anonymous columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username text UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_anonymous boolean DEFAULT false;
