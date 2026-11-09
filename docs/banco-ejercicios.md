# Banco de 22 ejercicios – PA3

Cada ejercicio incluye pregunta, respuesta, justificación y criterio de validación. Los ejemplos salen del propio proyecto (Gestión de Artículos). El enunciado remite a un "anexo" que no se recibió; si tu docente pide otro formato, el contenido se puede reordenar sin cambios.

---

## T01 – JavaScript moderno

**Ejercicio 1.** ¿Qué diferencia hay entre `.then()` y `async/await` para esperar una promesa? Reescribe con `async/await` la carga de artículos de `ArticulosContext.jsx`.
- **Respuesta:** Ambos esperan la promesa; `async/await` permite escribir el flujo en orden y manejar errores con `try/catch`. Ejemplo: `try { const { data } = await api.get('/articulos'); dispatch(...) } catch (e) { dispatch(...) }`.
- **Justificación:** `async/await` es azúcar sintáctico sobre promesas; evita anidar callbacks y unifica el manejo de errores.
- **Criterio de validación:** Usa `await` dentro de una función `async`, captura el error con `try/catch` y no mezcla `.then()` con `await`.

**Ejercicio 2.** Explica qué es una función pura y señala una en el proyecto.
- **Respuesta:** Una función pura devuelve siempre lo mismo para los mismos argumentos y no modifica nada fuera de ella. Ejemplo: el `reducer` de `ArticulosContext.jsx` o `tokenExpirado(token)`.
- **Justificación:** Facilita probar el código y prever el estado; el reducer devuelve un estado nuevo sin mutar el anterior.
- **Criterio de validación:** Menciona ausencia de efectos secundarios, mismo resultado para mismas entradas y no mutación (uso de spread / `map` / `filter`).

## T02 – TypeScript

**Ejercicio 3.** ¿Para qué sirve una `interface`? Muestra la de `Articulo` y explica por qué `_id` es opcional.
- **Respuesta:** Define la forma de un objeto para que el compilador la verifique. `_id?: string` es opcional porque al crear un artículo aún no existe: lo asigna MongoDB.
- **Justificación:** El tipo describe a la vez el artículo nuevo (sin `_id`) y el guardado (con `_id`).
- **Criterio de validación:** Escribe la interfaz con `?` en `_id`, `createdAt` y `updatedAt`, y justifica que los asigna el servidor.

**Ejercicio 4.** ¿Qué ventaja tiene la enumeración `Rol` frente a usar cadenas sueltas?
- **Respuesta:** `enum Rol { Admin = 'admin', Usuario = 'usuario' }` evita errores de escritura (`'admn'`) porque el compilador solo acepta valores definidos; y centraliza los roles.
- **Justificación:** Los strings sueltos fallan en silencio; el enum falla al compilar. Se usa en `AuthService.esAdmin` (`rol === Rol.Admin`).
- **Criterio de validación:** Define el enum con los valores del backend, y explica detección de errores en compilación y valores centralizados.

## T03 – Angular y componentes

**Ejercicio 5.** ¿Qué es un componente *standalone* y cómo se declara qué usa en su plantilla?
- **Respuesta:** Es un componente que no pertenece a un `NgModule`; declara sus dependencias en `imports: [...]` del decorador `@Component`, por ejemplo `imports: [ReactiveFormsModule, RouterLink]`.
- **Justificación:** Simplifica la estructura y hace explícitas las dependencias de cada componente.
- **Criterio de validación:** Menciona `@Component`, el arreglo `imports` y que no hay `NgModule`.

**Ejercicio 6.** En `lista-articulos.html`, ¿qué hacen `@if`, `@for` y `track`? ¿Por qué `track articulo._id`?
- **Respuesta:** `@if` muestra condicionalmente, `@for` repite elementos y `track` indica cómo identificar cada elemento. Con `_id` Angular reutiliza las filas existentes en lugar de recrearlas.
- **Justificación:** Un identificador estable mejora el rendimiento y evita perder estado de los elementos al cambiar la lista.
- **Criterio de validación:** Explica las tres construcciones y justifica `track` con un identificador único.

## T04 – Formularios y APIs en Angular

**Ejercicio 7.** Crea el `FormGroup` del registro con validaciones para nombre (3–60), correo y contraseña (mínimo 6).
- **Respuesta:** `fb.group({ nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]], email: ['', [Validators.required, Validators.email]], password: ['', [Validators.required, Validators.minLength(6)]] })`.
- **Justificación:** Las mismas reglas están en el backend (Mongoose y controlador): el frontend mejora la experiencia, el backend garantiza la seguridad.
- **Criterio de validación:** Usa `FormBuilder`, validadores correctos y muestra mensajes solo si el control fue tocado (`touched`).

**Ejercicio 8.** ¿Qué hace `authInterceptor` y por qué se registra con `withInterceptors`?
- **Respuesta:** Intercepta cada petición HTTP: agrega `Authorization: Bearer <token>` y, si el backend devuelve 401 con código de token expirado, cierra la sesión. Se registra en `provideHttpClient(withInterceptors([authInterceptor]))`.
- **Justificación:** Evita repetir el encabezado en cada servicio y centraliza el manejo de sesión vencida.
- **Criterio de validación:** Menciona clonar la petición (`req.clone`), el encabezado Bearer y la reacción al 401.

## T05 – Node.js y Express

**Ejercicio 9.** ¿Qué es un middleware en Express? Explica `verificarToken`.
- **Respuesta:** Una función `(req, res, next)` que se ejecuta antes del controlador. `verificarToken` lee el encabezado `Authorization`, valida el JWT, carga el usuario en `req.usuario` y llama a `next()`; si falla, responde 401.
- **Justificación:** Permite proteger muchas rutas con una sola línea (`router.use(verificarToken)`).
- **Criterio de validación:** Describe la firma `(req, res, next)`, el orden de ejecución y cuándo se corta la cadena.

**Ejercicio 10.** ¿Por qué la API devuelve 400, 401, 403, 404 y 409? Da un caso de cada una.
- **Respuesta:** 400 datos inválidos (precio 0); 401 sin sesión o token vencido; 403 con sesión pero sin permiso (usuario intenta eliminar); 404 recurso inexistente (id no encontrado); 409 conflicto (correo ya registrado).
- **Justificación:** Los códigos permiten que el cliente reaccione distinto: pedir login, mostrar un error o corregir datos.
- **Criterio de validación:** Distingue correctamente 401 (autenticación) de 403 (autorización).

## T06 – MongoDB y Mongoose

**Ejercicio 11.** ¿Qué es un esquema de Mongoose? Muestra las validaciones del campo `precio`.
- **Respuesta:** Define estructura, tipos y validaciones de un documento. `precio: { type: Number, required: [true, '...'], min: [0.01, 'El precio debe ser mayor a 0'] }`.
- **Justificación:** MongoDB no impone estructura; el esquema la aplica desde la aplicación y devuelve mensajes de error claros.
- **Criterio de validación:** Incluye tipo, `required` y `min` con mensaje.

**Ejercicio 12.** ¿Para qué sirven `unique: true` y `select: false` en `Usuario`?
- **Respuesta:** `unique` crea un índice que impide dos usuarios con el mismo correo (error 11000, devuelto como 409). `select: false` oculta el hash de la contraseña en las consultas; solo se obtiene con `.select('+password')` en el login.
- **Justificación:** Previene duplicados y reduce el riesgo de filtrar hashes.
- **Criterio de validación:** Explica ambos efectos y cita el caso del login.

## T07 – Autenticación y seguridad

**Ejercicio 13.** ¿Por qué se guarda un hash de bcrypt y no la contraseña? ¿Qué es el *salt*?
- **Respuesta:** Si la base se filtra, no se obtienen las contraseñas reales. bcrypt es lento a propósito y agrega un *salt* aleatorio, de modo que dos usuarios con la misma contraseña tienen hashes distintos.
- **Justificación:** Un hash es de una sola vía; el login compara con `bcrypt.compare(password, hash)`.
- **Criterio de validación:** Menciona hash unidireccional, salt y comparación con `compare` (no descifrar).

**Ejercicio 14.** Describe la estructura de un JWT y qué contiene el del proyecto. ¿Es secreto su contenido?
- **Respuesta:** Tres partes (encabezado, payload, firma) en Base64URL. El payload lleva `id`, `rol`, `iat` y `exp`. No es secreto (cualquiera puede leerlo), pero sí está firmado: sin `JWT_SECRET` no se puede alterar.
- **Justificación:** Por eso no se guardan datos sensibles en el payload; el servidor valida la firma en cada petición.
- **Criterio de validación:** Distingue "firmado" de "cifrado" y menciona la expiración.

**Ejercicio 15.** Explica por qué el registro ignora el campo `rol` del cuerpo de la petición.
- **Respuesta:** Si lo aceptara, cualquiera podría registrarse como `admin` enviando `{"rol":"admin"}`. El controlador fija `rol: 'usuario'`.
- **Justificación:** Es una escalada de privilegios (*mass assignment*); los administradores se crean por seed o en la base.
- **Criterio de validación:** Identifica el riesgo y la defensa (valor fijado en el servidor).

## T08 – Refactorización y control de cambios

**Ejercicio 16.** Qué se refactorizó al pasar de la PA2 a la PA3 y por qué.
- **Respuesta:** La URL de la API salió del servicio a `config.ts`; las rutas del backend se protegieron con middlewares; el `server.js` ahora valida variables de entorno y termina si falla la conexión.
- **Justificación:** Menos valores fijos en el código, un único punto de cambio para el despliegue y fallos visibles en lugar de silenciosos.
- **Criterio de validación:** Cada cambio está registrado en `CHANGELOG.md` con su motivo.

**Ejercicio 17.** ¿Qué debe y qué no debe registrarse en `CHANGELOG.md`? ¿Y qué va a Git y qué no?
- **Respuesta:** Se registran cambios relevantes agrupados (Añadido, Cambiado, Corregido) con fecha. A Git va el código y `.env.example`; nunca `.env`, `node_modules` ni credenciales.
- **Justificación:** El historial debe ser entendible por otra persona y no exponer secretos.
- **Criterio de validación:** Menciona `.gitignore` con `.env` y la existencia de `.env.example`.

## T09 – React y SPA

**Ejercicio 18.** ¿Qué hace `useEffect` en `Articulos`/`ArticulosContext`? ¿Qué pasa con el arreglo de dependencias?
- **Respuesta:** Ejecuta un efecto secundario (cargar artículos) cuando cambian sus dependencias. Con `[usuario, cargarArticulos]` se recarga al iniciar sesión y se limpia al cerrarla; con `[]` correría solo al montar.
- **Justificación:** Las dependencias definen cuándo se vuelve a ejecutar; omitirlas provoca datos desactualizados.
- **Criterio de validación:** Explica el arreglo de dependencias y da un ejemplo del proyecto.

**Ejercicio 19.** ¿Cómo se implementa una ruta protegida con React Router v6?
- **Respuesta:** Un componente `RutaProtegida` que, si no hay usuario, devuelve `<Navigate to="/login" />` y si lo hay devuelve `<Outlet />`; se usa como `<Route element={<RutaProtegida />}>` envolviendo las rutas privadas. Con `soloAdmin` exige además el rol.
- **Justificación:** Un solo componente protege varias rutas y conserva la ruta de origen en `state` para volver tras el login.
- **Criterio de validación:** Usa `Navigate`, `Outlet` y distingue los dos niveles (sesión y rol).

## T10 – Estado global

**Ejercicio 20.** ¿Por qué usar Context API + `useReducer` y no `useState` en cada página?
- **Respuesta:** La lista de artículos la usan varias páginas; en un contexto se carga una vez y todas se actualizan al crear, editar o eliminar. El reducer concentra los cambios en acciones (`AGREGADO`, `ACTUALIZADO`, `ELIMINADO`).
- **Justificación:** Evita pasar props por muchos niveles y mantiene el estado coherente; Redux sería excesivo para este tamaño.
- **Criterio de validación:** Describe Provider, hook de consumo (`useArticulos`) y acciones del reducer.

## T11 – APIs y sesiones en React

**Ejercicio 21.** ¿Cómo adjunta Axios el token y qué pasa si expiró?
- **Respuesta:** Un interceptor de petición agrega `Authorization: Bearer <token>`. Un interceptor de respuesta detecta `401` con `TOKEN_EXPIRED`/`TOKEN_INVALID`, llama al manejador de `AuthContext`, que borra el token, limpia el usuario y muestra el aviso en el login.
- **Justificación:** El manejo queda en un solo lugar y funciona para cualquier petición.
- **Criterio de validación:** Menciona ambos interceptores y la limpieza de sesión; verificable con un token alterado en `localStorage`.

**Ejercicio 22.** Ventajas y riesgos de guardar el JWT en `localStorage`. ¿Alternativa?
- **Respuesta:** Es simple y sobrevive a recargas, pero un ataque XSS podría leerlo. La alternativa más segura es una cookie `HttpOnly` + `SameSite`, que exige configurar cookies y CORS con credenciales en el backend.
- **Justificación:** Es un compromiso entre simplicidad y seguridad; en este trabajo se mitiga con expiración corta (1 h) y sin HTML inyectado (React/Angular escapan por defecto).
- **Criterio de validación:** Menciona XSS, la alternativa `HttpOnly` y al menos una mitigación.
