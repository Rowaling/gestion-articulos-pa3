const mongoose = require('mongoose');

const ROLES = ['admin', 'usuario'];

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [60, 'El nombre no puede superar los 60 caracteres']
    },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El correo no tiene un formato válido']
    },
    // Se guarda siempre el hash de bcrypt, nunca la contraseña en texto plano.
    // select:false evita que el hash salga en las consultas por defecto.
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      select: false
    },
    rol: {
      type: String,
      enum: { values: ROLES, message: 'El rol no es válido' },
      default: 'usuario'
    }
  },
  { timestamps: true }
);

// Quita el hash cuando el documento se convierte a JSON
usuarioSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
module.exports.ROLES = ROLES;
