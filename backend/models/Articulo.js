const mongoose = require('mongoose');

const articuloSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [100, 'El nombre no puede superar los 100 caracteres']
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      trim: true
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0.01, 'El precio debe ser mayor a 0']
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      maxlength: [300, 'La descripción no puede superar los 300 caracteres']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Articulo', articuloSchema);