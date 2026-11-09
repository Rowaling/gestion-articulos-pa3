# Sistema de Gestión de Artículos – PA3

Aplicación web Full Stack con **autenticación JWT y roles**. Dos clientes (Angular y React) consumen la misma API REST (Node + Express) y los mismos datos en MongoDB Atlas.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Cliente principal | Angular 22 (standalone), TypeScript, formularios reactivos, HttpClient + interceptor, guards, signals |
| Panel secundario | React 18 (Vite), React Router DOM 6, Axios, Context API + `useReducer` |
| Backend | Node.js, Express 5, Mongoose, `bcryptjs`, `jsonwebtoken`, CORS, dotenv |
| Base de datos | MongoDB Atlas (`articulosdb`: colecciones `articulos` y `usuarios`) |

## Estructura

```
gestion-articulos/
├── backend/            # API REST (controllers, models, routes, middlewares, seed.js)
├── frontend/           # Cliente Angular
├── panel-react/        # Panel React
├── docs/               # Informe técnico, banco de ejercicios, guía de despliegue
├── CHANGELOG.md
└── README.md
```

## Roles y permisos

| Acción | Sin sesión | `usuario` | `admin` |
|---|:-:|:-:|:-:|
| Registrarse / iniciar sesión | ✅ | – | – |
| Consultar artículos | ❌ | ✅ | ✅ |
| Registrar artículos | ❌ | ✅ | ✅ |
| Editar / eliminar artículos | ❌ | ❌ (403) | ✅ |

Todo registro público crea un `usuario`. El `admin` se crea con `seed.js`.

## API REST

Base: `http://localhost:3000/api`

| Método | Ruta | Acceso | Respuestas |
|---|---|---|---|
| POST | `/auth/registro` | Público | 201, 400, 409 |
| POST | `/auth/login` | Público | 200, 400, 401 |
| GET | `/auth/perfil` | Token | 200, 401 |
| GET | `/articulos` | Token | 200, 401 |
| GET | `/articulos/:id` | Token | 200, 400, 401, 404 |
| POST | `/articulos` | Token | 201, 400, 401 |
| PUT | `/articulos/:id` | Token + `admin` | 200, 400, 401, 403, 404 |
| DELETE | `/articulos/:id` | Token + `admin` | 200, 400, 401, 403, 404 |

Las rutas protegidas esperan el encabezado `Authorization: Bearer <token>`. Si el token venció, la API responde `401` con `codigo: "TOKEN_EXPIRED"` y ambos clientes cierran la sesión y llevan al login.

## Instrucciones de ejecución

Requisitos: Node.js LTS, una base MongoDB Atlas con acceso de red habilitado y (para Angular) `npm install -g @angular/cli`.

### 1. Backend
```
cd backend
npm install
cp .env.example .env     # en Windows: copy .env.example .env
```
Edita `.env`: pega tu `MONGODB_URI` y define un `JWT_SECRET` largo y aleatorio (ver comentario en `.env.example`). Luego:
```
npm run seed    # crea usuarios y artículos de prueba (no duplica si ya existen)
npm start
```
Debe mostrar `✅ Conectado a MongoDB Atlas` y `Servidor corriendo en http://localhost:3000`.

**Cuentas de prueba** (solo demo): `admin@demo.com` / `Admin123*` y `usuario@demo.com` / `Usuario123*` (cambian si defines `SEED_ADMIN_PASSWORD` o `SEED_USER_PASSWORD`).

### 2. Angular (otra terminal)
```
cd frontend
npm install
ng serve
```
Abrir http://localhost:4200

### 3. React (otra terminal)
```
cd panel-react
npm install
cp .env.example .env
npm run dev
```
Abrir http://localhost:5173

## Despliegue (Render + Vercel)

Ver [docs/despliegue.md](docs/despliegue.md).

## Seguridad

- Nunca se sube `.env` (está en `.gitignore`); solo `.env.example` sin credenciales reales.
- Contraseñas con bcrypt; el hash no sale en ninguna respuesta de la API (`select: false` + `toJSON`).
- El login responde igual si falla el correo o la contraseña.
- El rol se valida en el backend; ocultar botones en los clientes es solo comodidad visual.
