-- Conditional fix for news table column types
-- Checks the actual column type in information_schema before attempting conversion
-- This resolves conflicts where the state is ambiguous (bytea vs text)

DO $$
BEGIN
    -- Check and fix 'title' if it is bytea
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'news' 
        AND column_name = 'title' 
        AND data_type = 'bytea'
    ) THEN
        ALTER TABLE news ALTER COLUMN title TYPE VARCHAR(255) USING convert_from(title, 'UTF8');
    END IF;

    -- Check and fix 'content' if it is bytea
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'news' 
        AND column_name = 'content' 
        AND data_type = 'bytea'
    ) THEN
        ALTER TABLE news ALTER COLUMN content TYPE TEXT USING convert_from(content, 'UTF8');
    END IF;
END $$;
