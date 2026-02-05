-- Create Roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Create Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    active BOOLEAN DEFAULT TRUE
);

-- Create User_Roles relationship table
CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Create News table
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    publish_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiration_date TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    author_id INT,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Create News Images table
CREATE TABLE news_images (
    id SERIAL PRIMARY KEY,
    news_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
);

-- Insert initial roles
INSERT INTO roles (name) VALUES ('ROLE_SINDICA');
INSERT INTO roles (name) VALUES ('ROLE_ZELADOR');
INSERT INTO roles (name) VALUES ('ROLE_PROPRIETARIO');
INSERT INTO roles (name) VALUES ('ROLE_CONDOMINO');

-- Insert a default admin user (password: admin123 - BCrypt hashed)
-- User: admin, Pass: admin123
INSERT INTO users (username, password, full_name, active) 
VALUES ('admin', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uqqQ8m', 'Administradora Kondor', true);

-- Assign ROLE_SINDICA to admin user
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'admin' AND r.name = 'ROLE_SINDICA';
