-- Add highlighted column to news
ALTER TABLE news ADD COLUMN highlighted BOOLEAN NOT NULL DEFAULT FALSE;

-- Create help_contacts table
CREATE TABLE help_contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    role VARCHAR(100),
    is_emergency BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE
);
