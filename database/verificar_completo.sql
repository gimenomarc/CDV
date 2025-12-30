-- ============================================
-- VERIFICACIÓN COMPLETA DE LA BASE DE DATOS
-- ============================================

-- 1. Verificar que todas las tablas se crearon
SELECT 'TABLAS CREADAS:' as verificacion;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2. Verificar planes insertados (deberían ser 3)
SELECT 'PLANES INSERTADOS:' as verificacion;
SELECT id, nombre, precio, periodo, activo 
FROM plans 
ORDER BY precio;

-- 3. Verificar triggers creados
SELECT 'TRIGGERS CREADOS:' as verificacion;
SELECT trigger_name, event_object_table, action_timing, event_manipulation
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 4. Verificar funciones creadas
SELECT 'FUNCIONES CREADAS:' as verificacion;
SELECT routine_name, routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- 5. Verificar índices únicos parciales
SELECT 'ÍNDICES ÚNICOS PARCIALES:' as verificacion;
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE '%unique%'
ORDER BY indexname;

-- 6. Verificar políticas RLS (Row Level Security)
SELECT 'POLÍTICAS RLS:' as verificacion;
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 7. Verificar que RLS está habilitado en las tablas
SELECT 'RLS HABILITADO:' as verificacion;
SELECT tablename, rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

