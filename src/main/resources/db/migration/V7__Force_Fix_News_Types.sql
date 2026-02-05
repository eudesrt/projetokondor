-- Force fix column types for news table (Retry)
-- Use simple cast which works for both bytea (to hex) and text (no-op) to avoid "function does not exist" error
ALTER TABLE news ALTER COLUMN title TYPE VARCHAR(255) USING title::text;
ALTER TABLE news ALTER COLUMN content TYPE TEXT USING content::text;
