-- Ensure admin user and roles exist
-- Safe: uses INSERT ... WHERE NOT EXISTS

-- Ensure roles exist
INSERT INTO roles (name) SELECT 'ROLE_SINDICA'     WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_SINDICA');
INSERT INTO roles (name) SELECT 'ROLE_ZELADOR'     WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_ZELADOR');
INSERT INTO roles (name) SELECT 'ROLE_PROPRIETARIO' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_PROPRIETARIO');
INSERT INTO roles (name) SELECT 'ROLE_CONDOMINO'   WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_CONDOMINO');
INSERT INTO roles (name) SELECT 'ROLE_ADMIN'       WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_ADMIN');

-- Ensure admin user exists with plain text password
INSERT INTO users (username, password, full_name, active, status)
SELECT 'admin', 'admin', 'Administradora Kondor', true, 'APPROVED'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

-- Update admin password to plain text (in case it exists with bcrypt)
UPDATE users SET password = 'admin', active = true, status = 'APPROVED' WHERE username = 'admin';

-- Assign ROLE_SINDICA to admin
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ROLE_SINDICA'
AND NOT EXISTS (
    SELECT 1 FROM user_roles ur2
    WHERE ur2.user_id = u.id AND ur2.role_id = r.id
);
