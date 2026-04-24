-- Consolidated Initial Schema for Kondor Project
-- Includes all tables: roles, users, user_roles, news, news_images, comments, tickets, ticket_updates, ticket_attachments, help_contacts

-- 1. Roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Users table (Consolidated from V1 and V2)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    unit VARCHAR(20),
    status VARCHAR(20) DEFAULT 'APPROVED',
    active BOOLEAN DEFAULT TRUE
);

-- 3. User_Roles relationship table
CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 4. News table (Consolidated with fixed types and news fields)
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    publish_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiration_date TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    highlighted BOOLEAN NOT NULL DEFAULT FALSE,
    author_id INT,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- 5. News Images table
CREATE TABLE news_images (
    id SERIAL PRIMARY KEY,
    news_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
);

-- 6. Comments table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    author_id INT NOT NULL,
    news_id INT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
);

-- 7. Tickets table (Consolidated with privacy fields)
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    author_id INT NOT NULL,
    anonymous BOOLEAN DEFAULT FALSE,
    shared BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    parent_ticket_id INT,
    CONSTRAINT fk_tickets_author FOREIGN KEY (author_id) REFERENCES users(id),
    CONSTRAINT fk_tickets_parent FOREIGN KEY (parent_ticket_id) REFERENCES tickets(id)
);

-- 8. Ticket_updates table
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

-- 9. Ticket_attachments table
CREATE TABLE ticket_attachments (
    id SERIAL PRIMARY KEY,
    ticket_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    CONSTRAINT fk_attachments_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- 10. Help_contacts table (Consolidated with whatsapp field)
CREATE TABLE help_contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    role VARCHAR(100),
    is_emergency BOOLEAN NOT NULL DEFAULT FALSE,
    whatsapp BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 11. Initial Data Seeds

-- Insert initial roles
INSERT INTO roles (name) VALUES ('ROLE_SINDICA');
INSERT INTO roles (name) VALUES ('ROLE_ZELADOR');
INSERT INTO roles (name) VALUES ('ROLE_PROPRIETARIO');
INSERT INTO roles (name) VALUES ('ROLE_CONDOMINO');

-- Insert a default admin user (password: admin123)
-- User: admin, Pass: admin123
INSERT INTO users (username, password, full_name, active, status)
VALUES ('admin', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqQ8m', 'Administradora Kondor', true, 'APPROVED');

-- Assign ROLE_SINDICA to admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ROLE_SINDICA';
