# 📦 Comandos para subir a GitHub

## Pasos rápidos:

### 1. Crear archivo .env local (NO se subirá a GitHub)

Crea un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_SUPABASE_URL=https://cvvuudtkgqngceqdopbu.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sb_publishable_yENoh79IhD_udb8rxatdfg_lXwfjgNh
```

### 2. Verificar que Git está inicializado

```bash
git status
```

Si no está inicializado:
```bash
git init
```

### 3. Agregar todos los archivos

```bash
git add .
```

### 4. Verificar qué se va a subir (opcional)

```bash
git status
```

**IMPORTANTE:** Verifica que `.env` NO aparezca en la lista (debe estar en `.gitignore`)

### 5. Hacer commit

```bash
git commit -m "Initial commit: Aplicación Comunidad de Vecinos con Supabase"
```

### 6. Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Crea un nuevo repositorio
3. **NO** marques "Initialize with README" (ya tienes archivos)
4. Copia la URL del repositorio (ej: `https://github.com/tu-usuario/tu-repo.git`)

### 7. Conectar y subir

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

---

## ✅ Verificación

Después de subir, verifica en GitHub que:
- ✅ El archivo `.env` NO está visible
- ✅ El archivo `.env.example` SÍ está visible
- ✅ Todos los demás archivos están presentes

---

## 🔄 Actualizar después de cambios

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

