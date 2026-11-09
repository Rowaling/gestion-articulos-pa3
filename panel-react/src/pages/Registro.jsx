import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { mensajeDeError } from '../api/client.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Registro() {
  const { usuario, cargando, registrarse } = useAuth();
  const navigate = useNavigate();
  const [datos, setDatos] = useState({ nombre: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!cargando && usuario) return <Navigate to="/articulos" replace />;

  const cambiar = (campo) => (e) => setDatos({ ...datos, [campo]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    if (datos.nombre.trim().length < 3) return setError('El nombre debe tener al menos 3 caracteres.');
    if (!EMAIL_REGEX.test(datos.email.trim())) return setError('El correo no tiene un formato válido.');
    if (datos.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');

    setEnviando(true);
    try {
      await registrarse(datos.nombre.trim(), datos.email.trim(), datos.password);
      navigate('/articulos', { replace: true });
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo completar el registro'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form className="formulario auth" onSubmit={enviar} noValidate>
      <h2>Crear cuenta</h2>
      {error && <p className="alerta alerta-error">❌ {error}</p>}

      <div className="campo">
        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" type="text" value={datos.nombre} onChange={cambiar('nombre')} />
      </div>
      <div className="campo">
        <label htmlFor="email">Correo</label>
        <input id="email" type="email" value={datos.email} onChange={cambiar('email')} />
      </div>
      <div className="campo">
        <label htmlFor="password">Contraseña (mínimo 6 caracteres)</label>
        <input id="password" type="password" value={datos.password} onChange={cambiar('password')} />
      </div>

      <button type="submit" className="btn btn-principal" disabled={enviando}>
        {enviando ? 'Registrando...' : 'Registrarme'}
      </button>
      <p className="enlace">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </form>
  );
}
