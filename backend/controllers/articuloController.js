const mongoose = require('mongoose');
const Articulo = require('../models/Articulo');

// Maneja los errores y devuelve una respuesta JSON apropiada
const manejarError = (res, error) => {
  if (error.name === 'ValidationError') {
    const errores = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ mensaje: 'Datos inválidos', errores });
  }
  console.error(error);
  return res.status(500).json({ mensaje: 'Error interno del servidor' });
};

// Solo toma los campos permitidos del body
const extraerDatos = (body) => {
  const { nombre, categoria, precio, descripcion } = body;
  return { nombre, categoria, precio, descripcion };
};

// LEER todos
const obtenerArticulos = async (req, res) => {
  try {
    const articulos = await Articulo.find().sort({ createdAt: -1 });
    res.json(articulos);
  } catch (error) {
    manejarError(res, error);
  }
};

// LEER uno por id
const obtenerArticulo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ mensaje: 'El id no es válido' });
    }
    const articulo = await Articulo.findById(id);
    if (!articulo) {
      return res.status(404).json({ mensaje: 'Artículo no encontrado' });
    }
    res.json(articulo);
  } catch (error) {
    manejarError(res, error);
  }
};

// CREAR
const crearArticulo = async (req, res) => {
  try {
    const articulo = await Articulo.create(extraerDatos(req.body));
    res.status(201).json(articulo);
  } catch (error) {
    manejarError(res, error);
  }
};

// ACTUALIZAR
const actualizarArticulo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ mensaje: 'El id no es válido' });
    }
    const articulo = await Articulo.findByIdAndUpdate(
      id,
      extraerDatos(req.body),
      { new: true, runValidators: true }
    );
    if (!articulo) {
      return res.status(404).json({ mensaje: 'Artículo no encontrado' });
    }
    res.json(articulo);
  } catch (error) {
    manejarError(res, error);
  }
};

// ELIMINAR
const eliminarArticulo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ mensaje: 'El id no es válido' });
    }
    const articulo = await Articulo.findByIdAndDelete(id);
    if (!articulo) {
      return res.status(404).json({ mensaje: 'Artículo no encontrado' });
    }
    res.json({ mensaje: 'Artículo eliminado correctamente' });
  } catch (error) {
    manejarError(res, error);
  }
};

module.exports = {
  obtenerArticulos,
  obtenerArticulo,
  crearArticulo,
  actualizarArticulo,
  eliminarArticulo
};