// URL base de la API. En local apunta al backend en el puerto 3000;
// en producción (cualquier otro dominio) usa la URL del backend desplegado en Render.
// IMPORTANTE: cambia la URL de producción por la tuya antes de desplegar en Vercel.
const enLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';

export const API_URL = enLocal
  ? 'http://localhost:3000/api'
  : 'https://TU-BACKEND.onrender.com/api';
