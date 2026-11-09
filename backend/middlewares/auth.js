const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Verifica el token JWT del encabezado "Authorization: Bearer <token>"
// y deja el usuario en req.usuario. Responde 401 si falta o no es válido.
const verificarToken = async (req, res, next) => {
  try {
    const encabezado = req.headers.authorization || '';
    const [tipo, token] = encabezado.split(' ');

    if (tipo !== 'Bearer' || !token) {
      return res.status(401).json({ mensaje: 'Debes iniciar sesión para acceder', codigo: 'NO_TOKEN' });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ mensaje: 'Tu sesión ha expirado, inicia sesión de nuevo', codigo: 'TOKEN_EXPIRED' });
      }
      return res.status(401).json({ mensaje: 'Token inválido', codigo: 'TOKEN_INVALID' });
    }

    const usuario = await Usuario.findById(payload.id);
    if (!usuario) {
      return res.status(401).json({ mensaje: 'El usuario de este token ya no existe', codigo: 'TOKEN_INVALID' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    next(error);
  }
};

// Autorización por roles: permitirRoles('admin') deja pasar solo a administradores.
// Responde 403 si el usuario está autenticado pero no tiene el rol requerido.
const permitirRoles = (...rolesPermitidos) => (req, res, next) => {
  if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
    return res.status(403).json({ mensaje: 'No tienes permisos para realizar esta acción', codigo: 'FORBIDDEN' });
  }
  next();
};

module.exports = { verificarToken, permitirRoles };
