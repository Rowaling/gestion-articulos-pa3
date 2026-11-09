const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const SALT_ROUNDS = 10;

const generarToken = (usuario) =>
  jwt.sign(
    { id: usuario._id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );

const manejarError = (res, error) => {
  if (error.name === 'ValidationError') {
    const errores = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ mensaje: 'Datos inválidos', errores });
  }
  if (error.code === 11000) {
    return res.status(409).json({ mensaje: 'Ya existe un usuario con ese correo' });
  }
  console.error(error);
  return res.status(500).json({ mensaje: 'Error interno del servidor' });
};

// POST /api/auth/registro
// El rol NUNCA se toma del body: todo registro público crea un "usuario".
// Los administradores se crean desde seed.js o directamente en la base de datos.
const registrar = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        mensaje: 'Datos inválidos',
        errores: ['La contraseña debe tener al menos 6 caracteres']
      });
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const usuario = await Usuario.create({ nombre, email, password: hash, rol: 'usuario' });

    res.status(201).json({ mensaje: 'Usuario registrado correctamente', token: generarToken(usuario), usuario });
  } catch (error) {
    manejarError(res, error);
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
    }

    // Se pide el hash explícitamente porque el esquema lo oculta (select:false)
    const usuario = await Usuario.findOne({ email: email.toLowerCase().trim() }).select('+password');
    const coincide = usuario ? await bcrypt.compare(password, usuario.password) : false;

    // Mismo mensaje para correo o contraseña incorrectos: no revela cuál falló
    if (!coincide) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    res.json({ mensaje: 'Inicio de sesión exitoso', token: generarToken(usuario), usuario });
  } catch (error) {
    manejarError(res, error);
  }
};

// GET /api/auth/perfil (requiere token)
const perfil = (req, res) => {
  res.json({ usuario: req.usuario });
};

module.exports = { registrar, login, perfil };
