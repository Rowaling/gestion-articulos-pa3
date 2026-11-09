import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { mensajeDeError } from '../api/client.js';

export default function Login() {
  const { usuario, cargando, avisoSesion, iniciarSesion } = useAuth();
  const ubicacion = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!cargando && usuario) return <Navigate to={ubicacion.state?.desde || '/articulos'} replace />;

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Ingresa tu correo y tu contraseña.');
      return;
    }
    setEnviando(true);
    try {
      await iniciarSesion(email.trim(), password);
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo iniciar sesión'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form className="formulario auth" onSubmit={enviar} noValidate>
      <h2>Iniciar sesión</h2>
      {avisoSesion && <p className="alerta alerta-aviso">⚠️ {avisoSesion}</p>}
      {error && <p className="alerta alerta-error">❌ {error}</p>}

      <div className="campo">
        <label htmlFor="email">Correo</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" />
      </div>
      <div className="campo">
        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      <button type="submit" className="btn btn-principal" disabled={enviando}>
        {enviando ? 'Ingresando...' : 'Ingresar'}
      </button>
      <p className="enlace">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
    </form>
  );
}
