# 🚀 Guía de Despliegue en Vercel

## 📋 Pasos para subir a GitHub y desplegar en Vercel

### 1. Preparar el repositorio Git

#### A. Verificar que .gitignore está configurado correctamente

El archivo `.gitignore` ya debe incluir:
```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

#### B. Crear archivo .env local (NO se subirá a GitHub)

Crea un archivo `.env` en la raíz del proyecto con:

```env
REACT_APP_SUPABASE_URL=https://cvvuudtkgqngceqdopbu.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sb_publishable_yENoh79IhD_udb8rxatdfg_lXwfjgNh
```

**⚠️ IMPORTANTE:** Este archivo `.env` NO se subirá a GitHub gracias al `.gitignore`

---

### 2. Subir a GitHub

#### A. Inicializar Git (si no está inicializado)

```bash
git init
```

#### B. Agregar todos los archivos

```bash
git add .
```

#### C. Hacer commit

```bash
git commit -m "Initial commit: Aplicación Comunidad de Vecinos con Supabase"
```

#### D. Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Crea un nuevo repositorio (público o privado)
3. **NO** inicialices con README, .gitignore o licencia (ya los tienes)

#### E. Conectar y subir

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

---

### 3. Configurar Vercel

#### A. Conectar con GitHub

1. Ve a https://vercel.com
2. Inicia sesión con tu cuenta de GitHub
3. Haz clic en **"Add New Project"**
4. Selecciona tu repositorio de GitHub
5. Haz clic en **"Import"**

#### B. Configurar variables de entorno en Vercel

1. En la página de configuración del proyecto, ve a **"Environment Variables"**
2. Agrega las siguientes variables:

   **Variable 1:**
   - Name: `REACT_APP_SUPABASE_URL`
   - Value: `https://cvvuudtkgqngceqdopbu.supabase.co`
   - Environment: Selecciona todas (Production, Preview, Development)

   **Variable 2:**
   - Name: `REACT_APP_SUPABASE_ANON_KEY`
   - Value: `sb_publishable_yENoh79IhD_udb8rxatdfg_lXwfjgNh`
   - Environment: Selecciona todas (Production, Preview, Development)

3. Haz clic en **"Save"**

#### C. Configurar Build Settings

Vercel debería detectar automáticamente que es un proyecto React, pero verifica:

- **Framework Preset:** Create React App
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

#### D. Desplegar

1. Haz clic en **"Deploy"**
2. Espera a que termine el despliegue (2-3 minutos)
3. ¡Listo! Tu aplicación estará disponible en una URL de Vercel

---

### 4. Configurar CORS en Supabase (Importante)

Para que tu aplicación funcione en producción, necesitas configurar CORS en Supabase:

1. Ve a Supabase Dashboard > **Settings** > **API**
2. En **"Allowed CORS origins"**, agrega:
   - Tu URL de Vercel (ej: `https://tu-app.vercel.app`)
   - `http://localhost:3000` (para desarrollo local)
3. Haz clic en **Save**

---

### 5. Verificar el despliegue

1. Visita la URL que te dio Vercel
2. Prueba registrarte e iniciar sesión
3. Verifica que todo funcione correctamente

---

## 🔒 Seguridad

### ✅ Lo que está protegido:

- ✅ Las credenciales están en variables de entorno (no en el código)
- ✅ El archivo `.env` está en `.gitignore` (no se sube a GitHub)
- ✅ Solo la clave pública (anon key) se usa en el cliente (es segura)
- ✅ La clave secreta NO se expone en el cliente

### ⚠️ Notas importantes:

- La **anon key** es pública y está diseñada para usarse en el cliente
- La **secret key** nunca debe estar en el código del cliente
- Las variables de entorno en Vercel son seguras y privadas
- Row Level Security (RLS) en Supabase protege tus datos

---

## 📝 Comandos útiles

### Verificar estado de Git:
```bash
git status
```

### Ver qué archivos están siendo ignorados:
```bash
git status --ignored
```

### Actualizar después de cambios:
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

Vercel se actualizará automáticamente cuando hagas push a GitHub.

---

## 🐛 Troubleshooting

### Error: "Environment variable not found"
- Verifica que las variables estén configuradas en Vercel
- Asegúrate de que los nombres empiecen con `REACT_APP_`

### Error de CORS
- Agrega tu URL de Vercel a los orígenes permitidos en Supabase

### Build falla
- Verifica que `package.json` tenga todos los scripts necesarios
- Revisa los logs de build en Vercel para ver el error específico

---

¡Listo para desplegar! 🎉

