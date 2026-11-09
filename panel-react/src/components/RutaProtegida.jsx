import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Deja pasar solo a usuarios con sesión. Con soloAdmin también exige el rol admin.
export default function RutaProtegida({ soloAdmin = false }) {
  const { usuario, cargando, esAdmin } = useAuth();
  const ubicacion = useLocation();

  if (cargando) return <p className="centrado">Verificando sesión...</p>;
  if (!usuario) return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  if (soloAdmin && !esAdmin) return <Navigate to="/articulos" replace />;

  return <Outlet />;
}
