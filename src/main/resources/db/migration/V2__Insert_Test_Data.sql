-- Insert test roles (skip if already exist)
INSERT INTO roles (name) VALUES ('ROLE_RESIDENT') ON CONFLICT DO NOTHING;
INSERT INTO roles (name) VALUES ('ROLE_ADMIN') ON CONFLICT DO NOTHING;
INSERT INTO roles (name) VALUES ('ROLE_SINDICA') ON CONFLICT DO NOTHING;
INSERT INTO roles (name) VALUES ('ROLE_ZELADOR') ON CONFLICT DO NOTHING;

-- Insert test users (skip if already exist)
INSERT INTO users (username, password, full_name, email, phone, unit, status, active) VALUES
  ('admin', 'admin', 'Administrador', 'admin@test.com', '(11) 99999-9999', 'Sala 001', 'APPROVED', true),
  ('marina', 'marina', 'Marina Oliveira', 'marina@test.com', '(11) 98888-8888', 'Torre 1 • Apto 1208', 'APPROVED', true),
  ('joao', 'joao', 'João Silva', 'joao@test.com', '(11) 97777-7777', 'Torre 2 • Apto 503', 'APPROVED', true)
ON CONFLICT DO NOTHING;

-- Assign roles to users (skip if already exist)
INSERT INTO user_roles (user_id, role_id) VALUES
  ((SELECT id FROM users WHERE username = 'admin'), (SELECT id FROM roles WHERE name = 'ROLE_ADMIN')),
  ((SELECT id FROM users WHERE username = 'admin'), (SELECT id FROM roles WHERE name = 'ROLE_SINDICA')),
  ((SELECT id FROM users WHERE username = 'marina'), (SELECT id FROM roles WHERE name = 'ROLE_RESIDENT')),
  ((SELECT id FROM users WHERE username = 'joao'), (SELECT id FROM roles WHERE name = 'ROLE_RESIDENT'))
ON CONFLICT DO NOTHING;

-- Insert test help contacts (skip if already exist)
INSERT INTO help_contacts (name, phone_number, role, is_emergency, whatsapp, display_order, active) VALUES
  ('Portaria', '(11) 3000-0001', 'Portaria 24h', false, true, 1, true),
  ('Síndico', '(11) 3000-0002', 'Síndico', false, true, 2, true),
  ('Zelador', '(11) 3000-0003', 'Zelador', false, false, 3, true),
  ('Emergência Médica', '192', 'Emergência', true, false, 4, true)
ON CONFLICT DO NOTHING;

-- Insert test news (skip if already exist)
INSERT INTO news (title, content, publish_date, active, highlighted, author_id) VALUES
  ('Manutenção programada', 'Manutenção no elevador Torre A - sexta-feira', CURRENT_TIMESTAMP, true, true, (SELECT id FROM users WHERE username = 'admin')),
  ('Portaria 24h', 'Portaria funcionará normalmente nos feriados', CURRENT_TIMESTAMP - INTERVAL '1 day', true, false, (SELECT id FROM users WHERE username = 'admin'))
ON CONFLICT DO NOTHING;

-- Insert test help contacts for home screen display
INSERT INTO help_contacts (name, phone_number, role, whatsapp, active) VALUES
  ('Recepção', '(11) 3000-0100', 'Recepção', true, true),
  ('Manutenção', '(11) 3000-0200', 'Manutenção', false, true)
  ON CONFLICT DO NOTHING;
