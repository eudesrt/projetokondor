-- Comprehensive fix for all news table column types
-- This migration checks and fixes each column individually

DO $$
BEGIN
    -- Fix 'title' column if it is bytea
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'news' 
        AND column_name = 'title' 
        AND data_type = 'bytea'
    ) THEN
        RAISE NOTICE 'Converting title from bytea to VARCHAR(255)';
        ALTER TABLE news ALTER COLUMN title TYPE VARCHAR(255) USING convert_from(title, 'UTF8');
    END IF;

    -- Fix 'content' column if it is bytea
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'news' 
        AND column_name = 'content' 
        AND data_type = 'bytea'
    ) THEN
        RAISE NOTICE 'Converting content from bytea to TEXT';
        ALTER TABLE news ALTER COLUMN content TYPE TEXT USING convert_from(content, 'UTF8');
    END IF;

    -- Fix 'highlighted' column if it is bytea
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'news' 
        AND column_name = 'highlighted' 
        AND data_type = 'bytea'
    ) THEN
        RAISE NOTICE 'Converting highlighted from bytea to BOOLEAN';
        -- Convert bytea to boolean: assume non-empty bytea = true, empty/null = false
        ALTER TABLE news ALTER COLUMN highlighted TYPE BOOLEAN 
        USING CASE 
            WHEN highlighted IS NULL THEN false
            WHEN length(highlighted) > 0 THEN true
            ELSE false
        END;
    END IF;

    -- Fix 'active' column if it is bytea
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'news' 
        AND column_name = 'active' 
        AND data_type = 'bytea'
    ) THEN
        RAISE NOTICE 'Converting active from bytea to BOOLEAN';
        ALTER TABLE news ALTER COLUMN active TYPE BOOLEAN 
        USING CASE 
            WHEN active IS NULL THEN false
            WHEN length(active) > 0 THEN true
            ELSE false
        END;
    END IF;

    RAISE NOTICE 'News table column type fixes completed';
END $$;
