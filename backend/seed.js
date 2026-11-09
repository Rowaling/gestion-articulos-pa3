require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Articulo = require('./models/Articulo');
const Usuario = require('./models/Usuario');

const articulosPrueba = [
  { nombre: 'Laptop Lenovo IdeaPad 15', categoria: 'Electrónica', precio: 2499.9, descripcion: 'Laptop de 15.6 pulgadas con 8 GB de RAM y 512 GB de almacenamiento SSD.' },
  { nombre: 'Mouse inalámbrico Logitech', categoria: 'Electrónica', precio: 59.9, descripcion: 'Mouse inalámbrico ergonómico con receptor USB y batería de larga duración.' },
  { nombre: 'Audífonos Bluetooth Sony', categoria: 'Electrónica', precio: 189, descripcion: 'Audífonos inalámbricos con cancelación de ruido y 30 horas de batería.' },
  { nombre: 'Silla ergonómica de oficina', categoria: 'Oficina', precio: 459.5, descripcion: 'Silla con soporte lumbar, altura regulable y respaldo de malla transpirable.' },
  { nombre: 'Escritorio de madera 120 cm', categoria: 'Oficina', precio: 389, descripcion: 'Escritorio resistente de 120 cm, ideal para trabajo y estudio en casa.' },
  { nombre: 'Licuadora Oster 600W', categoria: 'Hogar', precio: 149.9, descripcion: 'Licuadora de 600 W con jarra de vidrio de 1.5 litros y 3 velocidades.' },
  { nombre: 'Juego de sábanas queen', categoria: 'Hogar', precio: 99, descripcion: 'Juego de sábanas de microfibra, suaves y fáciles de lavar.' },
  { nombre: 'Pelota de fútbol N°5', categoria: 'Deportes', precio: 79.9, descripcion: 'Pelota de fútbol oficial tamaño 5, costuras reforzadas y diseño resistente.' }
];

// Cuentas de prueba (solo para demo). Las contraseñas vienen del .env o usan estos valores de prueba.
const usuariosPrueba = [
  { nombre: 'Administrador', email: 'admin@demo.com', password: process.env.SEED_ADMIN_PASSWORD || 'Admin123*', rol: 'admin' },
  { nombre: 'Usuario Demo', email: 'usuario@demo.com', password: process.env.SEED_USER_PASSWORD || 'Usuario123*', rol: 'usuario' }
];

async function cargarUsuarios() {
  for (const u of usuariosPrueba) {
    const existe = await Usuario.findOne({ email: u.email });
    if (existe) {
      console.log(`El usuario ${u.email} ya existe. No se insertó.`);
      continue;
    }
    await Usuario.create({ ...u, password: await bcrypt.hash(u.password, 10) });
    console.log(`✅ Usuario creado: ${u.email} (${u.rol})`);
  }
}

async function cargarDatos() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    await cargarUsuarios();

    const cantidad = await Articulo.countDocuments();
    if (cantidad > 0) {
      console.log(`La colección ya tiene ${cantidad} artículos. No se insertó nada.`);
    } else {
      await Articulo.insertMany(articulosPrueba);
      console.log(`✅ Se insertaron ${articulosPrueba.length} artículos de prueba.`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

cargarDatos();