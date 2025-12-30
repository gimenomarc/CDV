# Instrucciones de Configuración de Supabase

## 📋 Checklist de Configuración

### ✅ Paso 1: Ejecutar el Esquema SQL

1. Abre el Dashboard de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **SQL Editor** (menú lateral izquierdo)
4. Haz clic en **New Query**
5. Abre el archivo `database/schema.sql` de este proyecto
6. Copia TODO el contenido del archivo
7. Pégalo en el SQL Editor
8. Haz clic en **Run** (o presiona Ctrl+Enter)
9. Verifica que no haya errores en la consola

### ✅ Paso 2: Configurar Storage para Archivos

1. En el Dashboard de Supabase, ve a **Storage** (menú lateral)
2. Haz clic en **Create a new bucket**
3. Configura el bucket:
   - **Name**: `actas`
   - **Public bucket**: ❌ Desactivado (solo usuarios autenticados)
   - Haz clic en **Create bucket**

4. Configura las políticas del bucket:
   - Ve a **Policies** dentro del bucket `actas`
   - Haz clic en **New Policy**
   - Selecciona **For full customization**
   - Nombre: `Allow authenticated users to upload`
   - Policy definition:
   ```sql
   (bucket_id = 'actas'::text) AND (auth.role() = 'authenticated'::text)
   ```
   - Allowed operation: `INSERT`
   - Haz clic en **Review** y luego **Save policy**

   - Crea otra política para lectura:
   - Nombre: `Allow authenticated users to read`
   - Policy definition:
   ```sql
   (bucket_id = 'actas'::text) AND (auth.role() = 'authenticated'::text)
   ```
   - Allowed operation: `SELECT`
   - Haz clic en **Review** y luego **Save policy**

### ✅ Paso 3: Verificar Autenticación

1. Ve a **Authentication** > **Settings**
2. Verifica que **Email** esté habilitado
3. Configura según tu entorno:
   - **Site URL**: 
     - Desarrollo: `http://localhost:3000`
     - Producción: Tu dominio real
   - **Enable email confirmations**: 
     - Desarrollo: ❌ Desactivado (más fácil para pruebas)
     - Producción: ✅ Activado (recomendado)

### ✅ Paso 4: Verificar Credenciales

Las credenciales ya están configuradas en `src/config/supabase.js`:
- ✅ URL del proyecto
- ✅ Anon Key (clave pública)

**IMPORTANTE**: La secret key está en el código solo para operaciones administrativas específicas. En producción, considera moverla a variables de entorno.

### ✅ Paso 5: Probar la Aplicación

1. Inicia la aplicación: `npm start`
2. Intenta registrarte con un email nuevo
3. Verifica que puedas iniciar sesión
4. Intenta subir una acta
5. Verifica que aparezca en el dashboard

## 🔍 Verificación de Datos

### Verificar que los planes se crearon:

En SQL Editor, ejecuta:
```sql
SELECT * FROM plans;
```

Deberías ver 3 planes:
- Plan Individual (1.99€)
- Plan Comunidad (50€)
- Plan Premium (99€)

### Verificar usuarios registrados:

```sql
SELECT * FROM auth.users;
```

### Verificar perfiles:

```sql
SELECT * FROM user_profiles;
```

## 🐛 Solución de Problemas

### Error: "relation does not exist"
- **Solución**: Ejecuta el script SQL completo en SQL Editor

### Error: "permission denied for table"
- **Solución**: Verifica que las políticas RLS estén correctamente configuradas
- Verifica que el usuario esté autenticado

### Error: "bucket does not exist"
- **Solución**: Crea el bucket `actas` en Storage

### Error al subir archivos: "new row violates row-level security policy"
- **Solución**: Verifica las políticas del bucket `actas` en Storage

### Usuario no puede ver sus datos
- **Solución**: Verifica que el usuario tenga un perfil creado en `user_profiles`
- Verifica que el usuario tenga una comunidad asignada

## 📝 Notas Importantes

1. **Primera vez**: Cuando un usuario se registra, se crea automáticamente su perfil en `user_profiles` gracias al trigger `handle_new_user()`

2. **Comunidades**: Los usuarios necesitan tener una comunidad asignada para:
   - Ver actas
   - Ver cuenta bancaria
   - Recibir notificaciones

3. **Logs**: Los logs se crean automáticamente para acciones importantes:
   - Login
   - Logout
   - Subida de actas
   - Suscripciones a planes

4. **Notificaciones**: Se crean automáticamente cuando:
   - Se sube una nueva acta (todos los usuarios de la comunidad la reciben)

## 🚀 Próximos Pasos

1. Crear comunidades de prueba en la base de datos
2. Asignar usuarios a comunidades
3. Crear datos de ejemplo (actas, movimientos bancarios, etc.)
4. Configurar variables de entorno para producción

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)

