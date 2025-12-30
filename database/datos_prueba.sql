-- ============================================
-- DATOS DE PRUEBA PARA DESARROLLO
-- ============================================

-- 1. Verificar que el perfil del usuario se creó automáticamente
SELECT 'PERFIL DEL USUARIO:' as verificacion;
SELECT id, nombre, telefono, comunidad_id, rol, created_at
FROM user_profiles
WHERE id = '44e0a421-e0c4-4bf1-aaec-a85bd49c9360';

-- 2. Crear una comunidad de prueba
INSERT INTO communities (nombre, direccion)
VALUES ('Comunidad de Vecinos Prueba', 'Calle Ejemplo 123, Madrid')
ON CONFLICT DO NOTHING
RETURNING id, nombre;

-- 3. Obtener el ID de la comunidad creada (ajusta el nombre si es necesario)
-- Si ya existe, obtén su ID:
SELECT id, nombre FROM communities WHERE nombre = 'Comunidad de Vecinos Prueba';

-- 4. Asignar el usuario a la comunidad (reemplaza COMMUNITY_ID con el ID obtenido arriba)
-- Ejemplo: UPDATE user_profiles SET comunidad_id = 'ID_DE_LA_COMUNIDAD' WHERE id = '44e0a421-e0c4-4bf1-aaec-a85bd49c9360';

-- 5. Crear cuenta bancaria de prueba para la comunidad
-- (Reemplaza COMMUNITY_ID con el ID real de la comunidad)
-- INSERT INTO bank_accounts (comunidad_id, numero_cuenta, entidad, saldo_actual, saldo_disponible)
-- VALUES (
--   'COMMUNITY_ID',
--   'ES91 2100 0418 4502 0005 1332',
--   'CaixaBank',
--   15000.00,
--   15000.00
-- )
-- ON CONFLICT (comunidad_id) DO NOTHING;

-- 6. Crear algunos movimientos bancarios de ejemplo
-- (Reemplaza ACCOUNT_ID con el ID de la cuenta bancaria)
-- INSERT INTO bank_movements (cuenta_id, concepto, importe, tipo, fecha)
-- VALUES
--   ('ACCOUNT_ID', 'Cuota comunidad - Enero 2025', 1200.00, 'ingreso', '2025-01-15'),
--   ('ACCOUNT_ID', 'Pago mantenimiento ascensor', -350.00, 'gasto', '2025-01-20'),
--   ('ACCOUNT_ID', 'Cuota comunidad - Febrero 2025', 1200.00, 'ingreso', '2025-02-15'),
--   ('ACCOUNT_ID', 'Limpieza comunidad', -200.00, 'gasto', '2025-02-18')
-- ON CONFLICT DO NOTHING;

-- ============================================
-- SCRIPT COMPLETO AUTOMÁTICO (ejecuta después de obtener los IDs)
-- ============================================

-- Paso 1: Crear comunidad (si no existe)
DO $$
DECLARE
  v_community_id UUID;
  v_account_id UUID;
BEGIN
  -- Crear o obtener comunidad
  INSERT INTO communities (nombre, direccion)
  VALUES ('Comunidad de Vecinos Prueba', 'Calle Ejemplo 123, Madrid')
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_community_id;
  
  -- Si ya existe, obtener su ID
  IF v_community_id IS NULL THEN
    SELECT id INTO v_community_id FROM communities WHERE nombre = 'Comunidad de Vecinos Prueba' LIMIT 1;
  END IF;
  
  -- Asignar usuario a la comunidad
  UPDATE user_profiles 
  SET comunidad_id = v_community_id 
  WHERE id = '44e0a421-e0c4-4bf1-aaec-a85bd49c9360';
  
  -- Crear cuenta bancaria
  INSERT INTO bank_accounts (comunidad_id, numero_cuenta, entidad, saldo_actual, saldo_disponible)
  VALUES (v_community_id, 'ES91 2100 0418 4502 0005 1332', 'CaixaBank', 15000.00, 15000.00)
  ON CONFLICT (comunidad_id) DO UPDATE
  SET numero_cuenta = EXCLUDED.numero_cuenta,
      entidad = EXCLUDED.entidad,
      saldo_actual = EXCLUDED.saldo_actual,
      saldo_disponible = EXCLUDED.saldo_disponible
  RETURNING id INTO v_account_id;
  
  -- Si ya existe, obtener su ID
  IF v_account_id IS NULL THEN
    SELECT id INTO v_account_id FROM bank_accounts WHERE comunidad_id = v_community_id LIMIT 1;
  END IF;
  
  -- Crear movimientos bancarios de ejemplo
  INSERT INTO bank_movements (cuenta_id, concepto, importe, tipo, fecha)
  VALUES
    (v_account_id, 'Cuota comunidad - Enero 2025', 1200.00, 'ingreso', '2025-01-15'),
    (v_account_id, 'Pago mantenimiento ascensor', -350.00, 'gasto', '2025-01-20'),
    (v_account_id, 'Cuota comunidad - Febrero 2025', 1200.00, 'ingreso', '2025-02-15'),
    (v_account_id, 'Limpieza comunidad', -200.00, 'gasto', '2025-02-18')
  ON CONFLICT DO NOTHING;
  
  RAISE NOTICE 'Comunidad creada/asignada: %', v_community_id;
  RAISE NOTICE 'Cuenta bancaria creada: %', v_account_id;
END $$;

-- Verificar que todo se creó correctamente
SELECT 'VERIFICACIÓN FINAL:' as verificacion;
SELECT 'Usuario y perfil:' as tipo, id::text as id, nombre, comunidad_id::text as comunidad_id
FROM user_profiles
WHERE id = '44e0a421-e0c4-4bf1-aaec-a85bd49c9360'
UNION ALL
SELECT 'Comunidad:' as tipo, id::text, nombre, NULL::text
FROM communities
WHERE nombre = 'Comunidad de Vecinos Prueba'
UNION ALL
SELECT 'Cuenta bancaria:' as tipo, id::text, numero_cuenta, comunidad_id::text
FROM bank_accounts
WHERE comunidad_id IN (SELECT id FROM communities WHERE nombre = 'Comunidad de Vecinos Prueba');

