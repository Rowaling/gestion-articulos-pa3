# Guía de despliegue (Render + Vercel + MongoDB Atlas)

Orden recomendado: **1) Backend → 2) Clientes → 3) CORS**. Sube primero el proyecto a GitHub (el `.gitignore` ya excluye `.env`).

## 1. Backend en Render
1. En Render: **New → Web Service** → conecta el repositorio.
2. **Root Directory:** `backend` · **Build Command:** `npm install` · **Start Command:** `npm start`.
3. **Environment Variables:**
   - `MONGODB_URI` = tu cadena de Atlas
   - `JWT_SECRET` = cadena larga aleatoria (distinta a la de local)
   - `JWT_EXPIRES_IN` = `1h`
   - `CORS_ORIGIN` = (por ahora vacío; se completa en el paso 3)
4. En MongoDB Atlas → **Network Access**, permite el acceso desde Render (`0.0.0.0/0` es lo más simple para un trabajo académico).
5. Al terminar, abre la URL (`https://tu-api.onrender.com/`) y debe responder `API de gestión de artículos funcionando`.
6. Para cargar usuarios de prueba en la base de Atlas, ejecuta `npm run seed` **en tu PC** con el `.env` apuntando a Atlas.

> El plan gratuito de Render "duerme" el servicio tras un rato sin uso: la primera petición puede tardar ~50 s. Ábrelo unos minutos antes de exponer.

## 2. Clientes en Vercel (dos proyectos)
**Angular**
1. Edita `frontend/src/app/config.ts` y cambia `https://TU-BACKEND.onrender.com/api` por la URL real de Render (terminando en `/api`).
2. En Vercel: **Add New → Project** → mismo repo, **Root Directory:** `frontend`, Framework: Angular. Output directory: `dist/frontend/browser`.
3. Añade `frontend/vercel.json` con `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }` para que las rutas funcionen al recargar.

**React**
1. **Add New → Project** → mismo repo, **Root Directory:** `panel-react`, Framework: Vite.
2. **Environment Variable:** `VITE_API_URL` = `https://tu-api.onrender.com/api`.
3. `vercel.json` ya incluye la regla para el router.

## 3. Cerrar el círculo con CORS
En Render, cambia `CORS_ORIGIN` a las dos URLs de Vercel separadas por coma y sin barra final:
```
https://tu-angular.vercel.app,https://tu-react.vercel.app
```
Render reinicia solo. Prueba el login en ambos clientes.

## Lista de verificación
- [ ] `GET /` de la API responde en la URL pública
- [ ] Login con `admin@demo.com` funciona en Angular y en React
- [ ] Con `usuario@demo.com` no aparecen Editar/Eliminar
- [ ] Un artículo creado en un cliente aparece en el otro
- [ ] No hay contraseñas ni `.env` en el repositorio
