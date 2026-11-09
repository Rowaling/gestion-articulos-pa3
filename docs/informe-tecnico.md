# Informe técnico – PA3: Proyecto de Desarrollo Web Full

**Estudiante:** Mattias Roque Calagua · **Curso:** Desarrollo Web Full · **Institución:** ISIL
**Proyecto:** Sistema de Gestión de Artículos (continuación de la PA2)
**Enlaces:** Repositorio: `<URL>` · Angular: `<URL>` · React: `<URL>` · API: `<URL>`

> Las secciones marcadas con 📸 necesitan tus capturas. El resto ya está redactado.

## 1. Introducción y objetivo
Se amplió el sistema de la PA2 con autenticación y autorización (bcrypt + JWT), un panel secundario en React con estado global y el despliegue de los tres componentes. Angular y React consumen la misma API REST y la misma base MongoDB Atlas.

## 2. Arquitectura
```
Angular (Vercel) ─┐
                  ├─► API REST Express (Render) ─► MongoDB Atlas
React   (Vercel) ─┘      JWT · bcrypt · roles
```
- Cada cliente guarda el JWT y lo envía en `Authorization: Bearer`.
- El backend valida token y rol en middlewares antes de llegar al controlador.
- CORS limitado a los dominios de los clientes (`CORS_ORIGIN`).

## 3. Estructura del proyecto
Ver el árbol en el `README.md`. Capas del backend: `routes` → `middlewares` → `controllers` → `models`.

## 4. Modelo de datos
**Usuario:** `nombre`, `email` (único), `password` (hash bcrypt, oculto), `rol` (`admin`|`usuario`), `createdAt`, `updatedAt`.
**Artículo:** `nombre` (3–100), `categoria`, `precio` (> 0), `descripcion` (≤ 300), `createdAt`, `updatedAt`.
📸 Captura de las colecciones en MongoDB Atlas (Browse Collections).

## 5. Endpoints
Tabla completa en el `README.md` (sección API REST).

## 6. Seguridad
- Contraseñas con bcrypt (10 rondas). El hash no se devuelve en ninguna respuesta.
- JWT con expiración de 1 h; códigos `NO_TOKEN`, `TOKEN_INVALID`, `TOKEN_EXPIRED` para que los clientes reaccionen.
- Autorización por rol en el servidor (403). El rol no se acepta desde el registro.
- Mensaje único para credenciales incorrectas. `.env` fuera del repositorio.

## 7. Implementación por cliente
**Angular:** login/registro con formularios reactivos, `AuthService` (signals), interceptor, guards, interfaz según rol.
**React:** Vite, Router v6, Axios con interceptores, Context API + `useReducer`, `RutaProtegida`, cierre de sesión y aviso por token expirado.
📸 Capturas: login Angular, lista como admin, lista como usuario, login React, lista React.

## 8. Pruebas realizadas
Completa con el resultado real de cada prueba (✅/❌) y una captura (puedes usar Postman/Thunder Client o el navegador).

| # | Prueba | Resultado esperado |
|---|---|---|
| 1 | Registro con correo nuevo | 201 + token |
| 2 | Registro con correo repetido | 409 |
| 3 | Registro con contraseña de 3 caracteres | 400 |
| 4 | Login con contraseña incorrecta | 401 |
| 5 | `GET /api/articulos` sin token | 401 |
| 6 | `GET /api/articulos` con token válido | 200 |
| 7 | `DELETE` con token de `usuario` | 403 |
| 8 | `DELETE` con token de `admin` | 200 |
| 9 | Token alterado en `localStorage` y recarga | Vuelve al login con aviso |
| 10 | Artículo creado en Angular visible en React | Aparece en ambos |
| 11 | Crear artículo con precio 0 | 400 + mensaje |

## 9. Despliegue
Ver `docs/despliegue.md`. 📸 Captura de la API en Render y de cada cliente en Vercel.

## 10. Conclusiones
- Separar autenticación (¿quién eres?) de autorización (¿qué puedes hacer?) simplificó las rutas: un middleware cubre toda la API.
- Compartir backend entre dos clientes obligó a mantener un contrato claro (códigos HTTP y mensajes).
- Mejoras futuras: refresh tokens, cookies `HttpOnly`, pruebas automáticas y paginación.

## 11. Anexos
- `CHANGELOG.md` · `docs/banco-ejercicios.md`
