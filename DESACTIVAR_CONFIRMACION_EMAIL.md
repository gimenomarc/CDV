# 🔧 Desactivar Confirmación de Email en Supabase

## Problema
Al intentar iniciar sesión, aparece el error: **"Email not confirmed"**

## Solución: Desactivar confirmación de email (para desarrollo)

### Pasos:

1. **Ve al Dashboard de Supabase**
   - https://supabase.com/dashboard
   - Selecciona tu proyecto

2. **Ve a Authentication > Settings**
   - En el menú lateral izquierdo, haz clic en **Authentication**
   - Luego haz clic en **Settings** (Configuración)

3. **Desactiva la confirmación de email**
   - Busca la sección **"Email Auth"**
   - Encuentra la opción **"Enable email confirmations"**
   - **Desactívala** (toggle OFF)

4. **Guarda los cambios**
   - Los cambios se guardan automáticamente

### ⚠️ Importante:

- **Para desarrollo**: Está bien desactivar la confirmación
- **Para producción**: Deberías activarla para mayor seguridad

### Alternativa: Confirmar el email manualmente

Si prefieres mantener la confirmación activada, puedes:

1. Ve a **Authentication > Users** en Supabase
2. Busca tu usuario `test@test.test`
3. Haz clic en los tres puntos (...) junto al usuario
4. Selecciona **"Confirm email"** o **"Resend confirmation email"**

---

**Después de desactivar la confirmación, podrás iniciar sesión sin problemas.** ✅

