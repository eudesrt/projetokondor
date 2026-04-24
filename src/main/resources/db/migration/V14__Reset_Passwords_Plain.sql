-- Force reset passwords to plain text for development
-- Ensures NoOpPasswordEncoder works regardless of previous state
UPDATE users SET password = 'admin'  WHERE username = 'admin';
UPDATE users SET password = 'marina' WHERE username = 'marina';
UPDATE users SET password = 'joao'   WHERE username = 'joao';

-- Ensure admin is active and approved
UPDATE users SET active = true, status = 'APPROVED' WHERE username = 'admin';
