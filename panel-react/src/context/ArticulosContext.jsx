import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import api, { mensajeDeError } from '../api/client.js';
import { useAuth } from './AuthContext.jsx';

const ArticulosContext = createContext(null);

const estadoInicial = { articulos: [], cargando: false, error: '' };

// Reducer: el estado global de artículos solo cambia a través de estas acciones
function reducer(estado, accion) {
  switch (accion.tipo) {
    case 'CARGANDO':
      return { ...estado, cargando: true, error: '' };
    case 'CARGADOS':
      return { articulos: accion.articulos, cargando: false, error: '' };
    case 'ERROR':
      return { ...estado, cargando: false, error: accion.mensaje };
    case 'AGREGADO':
      return { ...estado, articulos: [accion.articulo, ...estado.articulos] };
    case 'ACTUALIZADO':
      return {
        ...estado,
        articulos: estado.articulos.map((a) => (a._id === accion.articulo._id ? accion.articulo : a))
      };
    case 'ELIMINADO':
      return { ...estado, articulos: estado.articulos.filter((a) => a._id !== accion.id) };
    case 'LIMPIAR':
      return estadoInicial;
    default:
      return estado;
  }
}

export function ArticulosProvider({ children }) {
  const { usuario } = useAuth();
  const [estado, dispatch] = useReducer(reducer, estadoInicial);

  const cargarArticulos = useCallback(async () => {
    dispatch({ tipo: 'CARGANDO' });
    try {
      const { data } = await api.get('/articulos');
      dispatch({ tipo: 'CARGADOS', articulos: data });
    } catch (error) {
      dispatch({ tipo: 'ERROR', mensaje: mensajeDeError(error, 'No se pudieron cargar los artículos') });
    }
  }, []);

  // Se cargan al iniciar sesión y se limpian al cerrarla
  useEffect(() => {
    if (usuario) {
      cargarArticulos();
    } else {
      dispatch({ tipo: 'LIMPIAR' });
    }
  }, [usuario, cargarArticulos]);

  // Las operaciones lanzan el error hacia la pantalla para mostrar el mensaje al usuario
  const crearArticulo = async (datos) => {
    const { data } = await api.post('/articulos', datos);
    dispatch({ tipo: 'AGREGADO', articulo: data });
    return data;
  };

  const actualizarArticulo = async (id, datos) => {
    const { data } = await api.put(`/articulos/${id}`, datos);
    dispatch({ tipo: 'ACTUALIZADO', articulo: data });
    return data;
  };

  const eliminarArticulo = async (id) => {
    await api.delete(`/articulos/${id}`);
    dispatch({ tipo: 'ELIMINADO', id });
  };

  const valor = useMemo(
    () => ({ ...estado, cargarArticulos, crearArticulo, actualizarArticulo, eliminarArticulo }),
    [estado, cargarArticulos]
  );

  return <ArticulosContext.Provider value={valor}>{children}</ArticulosContext.Provider>;
}

export const useArticulos = () => {
  const ctx = useContext(ArticulosContext);
  if (!ctx) throw new Error('useArticulos debe usarse dentro de <ArticulosProvider>');
  return ctx;
};
