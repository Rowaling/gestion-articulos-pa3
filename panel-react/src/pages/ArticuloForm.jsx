import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { mensajeDeError } from '../api/client.js';
import { useArticulos } from '../context/ArticulosContext.jsx';

const CATEGORIAS = ['Electrónica', 'Oficina', 'Hogar', 'Deportes', 'Otros'];
const VACIO = { nombre: '', categoria: '', precio: '', descripcion: '' };

// Mismas reglas que el esquema de Mongoose y el formulario de Angular
function validar(d) {
  const errores = [];
  if (!d.nombre.trim()) errores.push('El nombre es obligatorio.');
  else if (d.nombre.trim().length < 3) errores.push('El nombre debe tener al menos 3 caracteres.');
  else if (d.nombre.trim().length > 100) errores.push('El nombre no puede superar los 100 caracteres.');
  if (!d.categoria) errores.push('Selecciona una categoría.');
  if (d.precio === '' || Number.isNaN(Number(d.precio))) errores.push('El precio es obligatorio.');
  else if (Number(d.precio) <= 0) errores.push('El precio debe ser mayor a 0.');
  if (!d.descripcion.trim()) errores.push('La descripción es obligatoria.');
  else if (d.descripcion.trim().length > 300) errores.push('La descripción no puede superar los 300 caracteres.');
  return errores;
}

export default function ArticuloForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { crearArticulo, actualizarArticulo } = useArticulos();
  const esEdicion = Boolean(id);

  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!esEdicion) return;
    api
      .get(`/articulos/${id}`)
      .then(({ data }) =>
        setDatos({ nombre: data.nombre, categoria: data.categoria, precio: String(data.precio), descripcion: data.descripcion })
      )
      .catch((err) => setErrores([mensajeDeError(err, 'No se pudo cargar el artículo')]))
      .finally(() => setCargando(false));
  }, [id, esEdicion]);

  const cambiar = (campo) => (e) => setDatos({ ...datos, [campo]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    const erroresLocales = validar(datos);
    setErrores(erroresLocales);
    if (erroresLocales.length) return;

    const articulo = {
      nombre: datos.nombre.trim(),
      categoria: datos.categoria,
      precio: Number(datos.precio),
      descripcion: datos.descripcion.trim()
    };

    setGuardando(true);
    try {
      if (esEdicion) await actualizarArticulo(id, articulo);
      else await crearArticulo(articulo);
      setMensaje(esEdicion ? 'Artículo actualizado correctamente.' : 'Artículo registrado correctamente.');
      setTimeout(() => navigate('/articulos'), 1000);
    } catch (err) {
      setErrores([mensajeDeError(err, 'No se pudo guardar el artículo')]);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section>
      <h2>{esEdicion ? 'Editar artículo' : 'Nuevo artículo'}</h2>

      {mensaje && <p className="alerta alerta-ok">✅ {mensaje}</p>}
      {errores.length > 0 && (
        <div className="alerta alerta-error">
          {errores.map((m) => <p key={m}>❌ {m}</p>)}
        </div>
      )}

      {cargando ? (
        <p>Cargando datos del artículo...</p>
      ) : (
        <form className="formulario" onSubmit={enviar} noValidate>
          <div className="campo">
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" type="text" value={datos.nombre} onChange={cambiar('nombre')} placeholder="Ej: Laptop Lenovo" />
          </div>
          <div className="campo">
            <label htmlFor="categoria">Categoría</label>
            <select id="categoria" value={datos.categoria} onChange={cambiar('categoria')}>
              <option value="">-- Selecciona una categoría --</option>
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="precio">Precio (S/)</label>
            <input id="precio" type="number" step="0.01" value={datos.precio} onChange={cambiar('precio')} placeholder="0.00" />
          </div>
          <div className="campo">
            <label htmlFor="descripcion">Descripción</label>
            <textarea id="descripcion" rows="4" value={datos.descripcion} onChange={cambiar('descripcion')} placeholder="Describe el artículo" />
          </div>
          <div className="botones">
            <button type="submit" className="btn btn-principal" disabled={guardando}>
              {guardando ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Guardar'}
            </button>
            <Link to="/articulos" className="btn btn-cancelar">Cancelar</Link>
          </div>
        </form>
      )}
    </section>
  );
}
