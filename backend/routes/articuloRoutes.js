const express = require('express');
const {
  obtenerArticulos,
  obtenerArticulo,
  crearArticulo,
  actualizarArticulo,
  eliminarArticulo
} = require('../controllers/articuloController');
const { verificarToken, permitirRoles } = require('../middlewares/auth');

const router = express.Router();

// Todas las rutas requieren sesión iniciada (JWT válido)
router.use(verificarToken);

// Cualquier usuario autenticado puede consultar y registrar
router.get('/', obtenerArticulos);
router.get('/:id', obtenerArticulo);
router.post('/', crearArticulo);

// Solo el administrador puede editar y eliminar
router.put('/:id', permitirRoles('admin'), actualizarArticulo);
router.delete('/:id', permitirRoles('admin'), eliminarArticulo);

module.exports = router;
