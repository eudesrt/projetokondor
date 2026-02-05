-- Migration for Ticket Management Module
-- Creates tables for tickets, updates and attachments

-- Drop existing if they were created by failed attempts or partial ddl-auto
DROP TABLE IF EXISTS ticket_attachments CASCADE;
DROP TABLE IF EXISTS ticket_updates CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;

CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    author_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    parent_ticket_id INT,
    CONSTRAINT fk_tickets_author FOREIGN KEY (author_id) REFERENCES users(id),
    CONSTRAINT fk_tickets_parent FOREIGN KEY (parent_ticket_id) REFERENCES tickets(id)
);

CREATE TABLE ticket_updates (
    id SERIAL PRIMARY KEY,
    ticket_id INT NOT NULL,
    author_id INT NOT NULL,
    message TEXT NOT NULL,
    new_status VARCHAR(50),
    additional_info VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_updates_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_updates_author FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE ticket_attachments (
    id SERIAL PRIMARY KEY,
    ticket_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    CONSTRAINT fk_attachments_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);
