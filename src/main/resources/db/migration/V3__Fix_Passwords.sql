-- Padroniza todas as senhas para plain text para desenvolvimento
UPDATE users SET password = 'admin'  WHERE username = 'admin';
UPDATE users SET password = 'marina' WHERE username = 'marina';
UPDATE users SET password = 'joao'   WHERE username = 'joao';
