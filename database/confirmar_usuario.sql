-- Confirmar email del usuario manualmente
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'test@test.test';

-- Verificar que se confirmó
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
WHERE email = 'test@test.test';

