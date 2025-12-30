# 🔧 Solución: Email not confirmed

## Opción 1: Desactivar confirmación de email (Recomendado para desarrollo)

### Pasos:

1. **En la página que estás viendo (Authentication > Providers):**
   - Busca la sección **"User Signups"**
   - Encuentra la opción **"Confirm email"**
   - **Desactívala** (toggle OFF / desmarcar)
   - Haz clic en **"Save changes"** (botón al final de la página)

2. **Recarga la aplicación y vuelve a intentar iniciar sesión**

---

## Opción 2: Confirmar el email manualmente (Si quieres mantener la confirmación activada)

### Pasos:

1. **Ve a Authentication > Users** en el menú lateral
2. **Busca tu usuario** `test@test.test`
3. **Haz clic en los tres puntos (...)** junto al usuario
4. Selecciona **"Confirm email"** o busca el botón de confirmación
5. **Alternativamente**, puedes ejecutar este SQL:

```sql
-- Confirmar email del usuario manualmente
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'test@test.test';
```

---

## Opción 3: Reenviar email de confirmación

1. **Ve a Authentication > Users**
2. Busca tu usuario
3. Haz clic en los tres puntos (...)
4. Selecciona **"Resend confirmation email"**

---

## ⚠️ Importante:

- **Para desarrollo**: Desactiva "Confirm email" (Opción 1)
- **Para producción**: Mantén la confirmación activada y usa Opción 2 o 3

**La forma más rápida es la Opción 1: desactivar "Confirm email" y hacer clic en "Save changes".**

