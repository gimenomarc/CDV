# Configuración de Supabase

## Pasos para configurar la base de datos

### 1. Ejecutar el esquema SQL

1. Ve a tu proyecto en Supabase Dashboard: https://supabase.com/dashboard
2. Navega a **SQL Editor** en el menú lateral
3. Abre el archivo `database/schema.sql` de este proyecto
4. Copia todo el contenido y pégalo en el SQL Editor
5. Haz clic en **Run** para ejecutar el script

Esto creará todas las tablas, relaciones, índices, triggers y políticas de seguridad (RLS).

### 2. Configurar Storage para archivos de actas

1. En el Dashboard de Supabase, ve a **Storage**
2. Crea un nuevo bucket llamado `actas`
3. Configura las políticas:
   - **Public Access**: Desactivado (solo usuarios autenticados pueden acceder)
   - **File size limit**: Configura según tus necesidades (ej: 10MB)
   - **Allowed MIME types**: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

### 3. Verificar configuración de autenticación

1. Ve a **Authentication** > **Settings** en el Dashboard
2. Asegúrate de que **Email** esté habilitado como método de autenticación
3. Configura las opciones de email según tus preferencias:
   - **Enable email confirmations**: Opcional (recomendado para producción)
   - **Site URL**: Tu URL de producción o `http://localhost:3000` para desarrollo

### 4. Verificar las credenciales

Las credenciales ya están configuradas en `src/config/supabase.js`:
- **URL del proyecto**: `https://cvvuudtkgqngceqdopbu.supabase.co`
- **Anon Key**: Configurada en el archivo

### 5. Datos iniciales

El script SQL ya inserta los planes iniciales:
- Plan Individual (1.99€/mes)
- Plan Comunidad (50€/mes)
- Plan Premium + IA (99€/mes)

### 6. Estructura de la base de datos

#### Tablas principales:
- **communities**: Comunidades de vecinos
- **plans**: Planes de precios
- **user_profiles**: Perfiles de usuarios (extiende auth.users)
- **user_subscriptions**: Suscripciones usuario-plan
- **actas**: Actas de reuniones
- **notifications**: Notificaciones de usuarios
- **bank_accounts**: Cuentas bancarias de comunidades
- **bank_movements**: Movimientos bancarios
- **user_logs**: Logs de actividad de usuarios
- **votaciones**: Votaciones (para futuro)
- **votes**: Votos individuales (para futuro)

### 7. Row Level Security (RLS)

Todas las tablas tienen RLS habilitado con políticas que:
- Permiten a los usuarios ver solo sus propios datos
- Permiten a los usuarios ver datos de su comunidad
- Restringen la inserción/actualización según roles

### 8. Funciones y Triggers

- **update_updated_at_column()**: Actualiza automáticamente el campo `updated_at`
- **handle_new_user()**: Crea automáticamente un perfil cuando se registra un usuario

## Notas importantes

- Los usuarios se registran a través de Supabase Auth
- Los perfiles se crean automáticamente al registrarse
- Los logs se crean automáticamente para acciones importantes
- Las notificaciones se crean automáticamente cuando se suben actas

## Troubleshooting

### Error: "relation does not exist"
- Asegúrate de haber ejecutado el script SQL completo

### Error: "permission denied"
- Verifica que las políticas RLS estén correctamente configuradas
- Asegúrate de que el usuario esté autenticado

### Error: "bucket does not exist"
- Crea el bucket `actas` en Storage con las políticas correctas

### Error al subir archivos
- Verifica que el bucket `actas` exista
- Verifica los permisos del bucket
- Verifica el tamaño máximo del archivo

