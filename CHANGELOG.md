# Bitácora de cambios (CHANGELOG)

Registro de observaciones, correcciones y mejoras. Formato: fecha, tipo y detalle.

## [PA3] – 2026-11-08

### Añadido
- **Backend – autenticación:** modelo `Usuario` (nombre, correo único, contraseña, rol), registro, inicio de sesión y `GET /api/auth/perfil`.
- **Backend – seguridad:** contraseñas cifradas con `bcryptjs` (10 rondas) y sesiones con JWT firmados con `JWT_SECRET` y expiración configurable (`JWT_EXPIRES_IN`).
- **Backend – middlewares:** `verificarToken` (valida el JWT y distingue token ausente, inválido y expirado con códigos propios) y `permitirRoles` (autorización por rol, responde 403).
- **Backend – roles:** `admin` (CRUD completo) y `usuario` (consultar y registrar). El rol nunca se toma del cuerpo del registro.
- **Backend – configuración:** CORS por lista de orígenes (`CORS_ORIGIN`), validación de variables de entorno al arrancar, scripts `npm start` y `npm run seed`.
- **Seed:** crea las cuentas de prueba `admin@demo.com` y `usuario@demo.com` además de los artículos.
- **Panel React (nuevo):** Vite + React 18, React Router DOM, Axios con interceptores, estado global con Context API + `useReducer`, rutas protegidas (por sesión y por rol), cierre de sesión y manejo de token expirado.
- **Angular:** pantallas de login y registro (formularios reactivos con validador personalizado), `AuthService` con signals, interceptor HTTP que adjunta el token, guards `authGuard`, `adminGuard` e `invitadoGuard`, barra de navegación según sesión y rol.
- **Tipos TypeScript:** enumeración `Rol` e interfaces de usuario/autenticación en `usuario.model.ts`.
- **Documentación:** README ampliado, banco de 22 ejercicios, base del informe técnico y guía de despliegue.

### Cambiado
- Todas las rutas de `/api/articulos` ahora exigen JWT; `PUT` y `DELETE` exigen rol `admin`.
- La URL de la API en Angular salió del servicio y pasó a `src/app/config.ts` (local vs producción).
- La lista de Angular oculta "Editar" y "Eliminar" a quien no es administrador y muestra el mensaje de error real del servidor.
- `server.js` termina el proceso si falla la conexión a MongoDB (antes quedaba "vivo" sin servidor).

### Corregido
- Un fallo de conexión a la base ya no deja el proceso colgado sin escuchar peticiones.

### Observaciones
- `package-lock.json` del backend debe regenerarse con `npm install` por las dependencias nuevas.
- Se mantiene Angular 22 (la versión de la PA2) en lugar de Angular 16.

## [PA2] – Versión inicial
- CRUD de artículos con Angular, Express y MongoDB Atlas; validaciones en frontend y backend; dashboard y mensajes de confirmación/error.
