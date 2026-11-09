import axios from 'axios';

const TOKEN_KEY = 'token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Lee la fecha de expiración (exp) del payload del JWT, sin verificar la firma.
// La verificación real siempre la hace el backend; esto solo evita usar un token ya vencido.
export function tokenExpirado(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return !payload.exp || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

// Cada petición lleva el token en el encabezado Authorization
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si el backend responde 401 (token vencido o inválido) se cierra la sesión.
// El AuthContext registra aquí su función para reaccionar.
let alSesionExpirada = () => {};
export const registrarManejadorSesionExpirada = (fn) => {
  alSesionExpirada = fn;
};

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const status = error.response?.status;
    const codigo = error.response?.data?.codigo;
    // El 401 del login (credenciales incorrectas) no trae código: no es una sesión expirada
    if (status === 401 && (codigo === 'TOKEN_EXPIRED' || codigo === 'TOKEN_INVALID' || codigo === 'NO_TOKEN')) {
      alSesionExpirada(error.response.data.mensaje);
    }
    return Promise.reject(error);
  }
);

// Extrae un mensaje legible de un error de Axios
export function mensajeDeError(error, porDefecto = 'Ocurrió un error inesperado') {
  const data = error.response?.data;
  if (Array.isArray(data?.errores) && data.errores.length) return data.errores.join('. ');
  if (data?.mensaje) return data.mensaje;
  if (!error.response) return 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
  return porDefecto;
}

export default api;
