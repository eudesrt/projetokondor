-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN email VARCHAR(100) UNIQUE,
ADD COLUMN phone VARCHAR(20),
ADD COLUMN unit VARCHAR(20),
ADD COLUMN status VARCHAR(20) DEFAULT 'APPROVED';

-- Update existing users to have APPROVED status
UPDATE users SET status = 'APPROVED' WHERE status IS NULL;
