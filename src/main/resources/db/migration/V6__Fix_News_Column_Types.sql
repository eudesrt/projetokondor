-- Fix column types for news table
-- Convert bytea columns to text
ALTER TABLE news ALTER COLUMN title TYPE VARCHAR(255) USING title::text;
ALTER TABLE news ALTER COLUMN content TYPE TEXT USING content::text;
