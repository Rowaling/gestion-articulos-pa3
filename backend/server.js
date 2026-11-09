require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const articuloRoutes = require('./routes/articuloRoutes');
const authRoutes = require('./routes/authRoutes');

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('❌ Faltan variables de entorno: define MONGODB_URI y JWT_SECRET (ver .env.example)');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// CORS_ORIGIN: lista de orígenes permitidos separados por coma.
// Si no se define, se permite cualquier origen (útil solo en desarrollo).
const origenes = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(cors(origenes.length ? { origin: origenes } : undefined));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de gestión de artículos funcionando' });
});

// Rutas de la API REST
app.use('/api/auth', authRoutes);
app.use('/api/articulos', articuloRoutes);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Manejo de errores generales (por ejemplo, JSON mal formado)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El JSON enviado no es válido' });
  }
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    process.exit(1);
  });
