-- Standardize all passwords to plain text for development
-- This runs as V13 because V3 was already applied (V3__Create_Comments_Table.sql)
UPDATE users SET password = 'admin'  WHERE username = 'admin';
UPDATE users SET password = 'marina' WHERE username = 'marina';
UPDATE users SET password = 'joao'   WHERE username = 'joao';
