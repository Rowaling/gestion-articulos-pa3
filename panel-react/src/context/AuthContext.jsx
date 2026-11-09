import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api, {
  clearToken,
  getToken,
  registrarManejadorSesionExpirada,
  setToken,
  tokenExpirado
} from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  // Mientras se valida el token guardado no se decide si mostrar login o contenido
  const [cargando, setCargando] = useState(true);
  const [avisoSesion, setAvisoSesion] = useState('');

  const cerrarSesion = useCallback(() => {
    clearToken();
    setUsuario(null);
  }, []);

  const sesionExpirada = useCallback(
    (mensaje) => {
      cerrarSesion();
      setAvisoSesion(mensaje || 'Tu sesión ha expirado, inicia sesión de nuevo');
    },
    [cerrarSesion]
  );

  // El interceptor de Axios avisa aquí cuando el backend rechaza el token
  useEffect(() => {
    registrarManejadorSesionExpirada(sesionExpirada);
  }, [sesionExpirada]);

  // Al abrir la app: si hay un token guardado y no está vencido, se recupera el usuario
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setCargando(false);
      return;
    }
    if (tokenExpirado(token)) {
      sesionExpirada();
      setCargando(false);
      return;
    }
    api
      .get('/auth/perfil')
      .then((res) => setUsuario(res.data.usuario))
      .catch(() => cerrarSesion())
      .finally(() => setCargando(false));
  }, [cerrarSesion, sesionExpirada]);

  const iniciarSesion = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token);
    setAvisoSesion('');
    setUsuario(data.usuario);
  };

  const registrarse = async (nombre, email, password) => {
    const { data } = await api.post('/auth/registro', { nombre, email, password });
    setToken(data.token);
    setAvisoSesion('');
    setUsuario(data.usuario);
  };

  const valor = useMemo(
    () => ({
      usuario,
      cargando,
      avisoSesion,
      esAdmin: usuario?.rol === 'admin',
      iniciarSesion,
      registrarse,
      cerrarSesion
    }),
    [usuario, cargando, avisoSesion, cerrarSesion]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
};
