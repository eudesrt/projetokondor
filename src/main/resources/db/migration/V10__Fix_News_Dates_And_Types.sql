DO $$
BEGIN
    -- 1. Fix Publish Date (bytea -> timestamp)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'news' AND column_name = 'publish_date' AND data_type = 'bytea'
    ) THEN
        ALTER TABLE news ALTER COLUMN publish_date TYPE TIMESTAMP USING convert_from(publish_date, 'UTF8')::timestamp;
    END IF;

    -- 2. Fix Expiration Date (bytea -> timestamp)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'news' AND column_name = 'expiration_date' AND data_type = 'bytea'
    ) THEN
        ALTER TABLE news ALTER COLUMN expiration_date TYPE TIMESTAMP USING convert_from(expiration_date, 'UTF8')::timestamp;
    END IF;

    -- 3. Re-Verify Highlighted (bytea -> boolean) - Safety check
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'news' AND column_name = 'highlighted' AND data_type = 'bytea'
    ) THEN
        ALTER TABLE news ALTER COLUMN highlighted TYPE BOOLEAN USING (convert_from(highlighted, 'UTF8') = 'true');
    END IF;

    -- 4. Re-Verify Title (bytea -> varchar) - Safety check
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'news' AND column_name = 'title' AND data_type = 'bytea'
    ) THEN
        ALTER TABLE news ALTER COLUMN title TYPE VARCHAR(500) USING convert_from(title, 'UTF8');
    END IF;

    -- 5. Re-Verify Active (bytea -> boolean) - Safety check
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'news' AND column_name = 'active' AND data_type = 'bytea'
    ) THEN
        ALTER TABLE news ALTER COLUMN active TYPE BOOLEAN USING (convert_from(active, 'UTF8') = 'true');
    END IF;

    -- 6. Re-Verify Content (bytea -> text) - Safety check
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'news' AND column_name = 'content' AND data_type = 'bytea'
    ) THEN
        ALTER TABLE news ALTER COLUMN content TYPE TEXT USING convert_from(content, 'UTF8');
    END IF;

END $$;
