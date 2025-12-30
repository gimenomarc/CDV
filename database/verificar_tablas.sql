-- Script para verificar que todas las tablas se crearon correctamente

-- Verificar tablas principales
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar planes insertados
SELECT id, nombre, precio, periodo, activo 
FROM plans 
ORDER BY precio;

-- Verificar que los triggers existen
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Verificar que las funciones existen
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';

-- Verificar índices únicos parciales
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE '%unique%';

