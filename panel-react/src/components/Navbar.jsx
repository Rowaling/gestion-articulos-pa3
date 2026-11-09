import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { usuario, esAdmin, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const salir = () => {
    cerrarSesion();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <span className="marca">📦 Panel de Artículos</span>
      {usuario && (
        <div className="menu">
          <NavLink to="/articulos" end>Artículos</NavLink>
          <NavLink to="/articulos/nuevo">Nuevo artículo</NavLink>
          <span className="usuario">
            {usuario.nombre} <small className={`rol rol-${usuario.rol}`}>{usuario.rol}</small>
          </span>
          <button className="btn btn-secundario" onClick={salir}>Cerrar sesión</button>
        </div>
      )}
    </nav>
  );
}
