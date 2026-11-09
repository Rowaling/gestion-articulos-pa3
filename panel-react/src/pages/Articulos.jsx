import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useArticulos } from '../context/ArticulosContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { mensajeDeError } from '../api/client.js';

const formatoPrecio = (n) => Number(n).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Articulos() {
  const { articulos, cargando, error, eliminarArticulo } = useArticulos();
  const { esAdmin } = useAuth();
  const [mensaje, setMensaje] = useState('');
  const [errorAccion, setErrorAccion] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const filtrados = articulos.filter((a) =>
    `${a.nombre} ${a.categoria}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const eliminar = async (articulo) => {
    if (!window.confirm(`¿Seguro que deseas eliminar "${articulo.nombre}"?`)) return;
    setErrorAccion('');
    try {
      await eliminarArticulo(articulo._id);
      setMensaje(`Artículo "${articulo.nombre}" eliminado correctamente.`);
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      setErrorAccion(mensajeDeError(err, 'No se pudo eliminar el artículo'));
    }
  };

  return (
    <section>
      <div className="encabezado">
        <h2>Lista de artículos</h2>
        <Link to="/articulos/nuevo" className="btn btn-principal">+ Nuevo artículo</Link>
      </div>

      {mensaje && <p className="alerta alerta-ok">✅ {mensaje}</p>}
      {(error || errorAccion) && <p className="alerta alerta-error">❌ {error || errorAccion}</p>}
      {!esAdmin && <p className="alerta alerta-aviso">Tu rol es <strong>usuario</strong>: puedes consultar y registrar artículos. Editar y eliminar es solo para administradores.</p>}

      <input
        className="buscador"
        type="search"
        placeholder="Buscar por nombre o categoría..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {cargando ? (
        <p>Cargando artículos...</p>
      ) : filtrados.length === 0 ? (
        <p>{articulos.length === 0 ? 'No hay artículos registrados todavía.' : 'Ningún artículo coincide con la búsqueda.'}</p>
      ) : (
        <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Descripción</th>
                {esAdmin && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((a) => (
                <tr key={a._id}>
                  <td>{a.nombre}</td>
                  <td>{a.categoria}</td>
                  <td>S/ {formatoPrecio(a.precio)}</td>
                  <td>{a.descripcion}</td>
                  {esAdmin && (
                    <td className="acciones">
                      <Link to={`/articulos/editar/${a._id}`} className="btn btn-editar">Editar</Link>
                      <button className="btn btn-eliminar" onClick={() => eliminar(a)}>Eliminar</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
