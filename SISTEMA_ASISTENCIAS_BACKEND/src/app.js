const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ MIDDLEWARE DE DIAGNÓSTICO (AGREGA ESTO)
app.use((req, res, next) => {
  console.log(`📨 ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

console.log('🚀 Iniciando carga de rutas...');

// Rutas con manejo de errores
try {
  app.use('/api/auth', require('./routes/auth'));
  console.log('✅ /api/auth - CARGADA');
} catch (error) {
  console.log('❌ /api/auth - ERROR:', error.message);
}

try {
  app.use('/api/usuarios', require('./routes/usuarios'));
  console.log('✅ /api/usuarios - CARGADA');
} catch (error) {
  console.log('❌ /api/usuarios - ERROR:', error.message);
}

try {
  app.use('/api/asistencias', require('./routes/asistencias'));
  console.log('✅ /api/asistencias - CARGADA');
} catch (error) {
  console.log('❌ /api/asistencias - ERROR:', error.message);
}

try {
  app.use('/api/areas', require('./routes/areas'));
  console.log('✅ /api/areas - CARGADA');
} catch (error) {
  console.log('❌ /api/areas - ERROR:', error.message);
}

try {
  app.use('/api/reportes', require('./routes/reportes'));
  console.log('✅ /api/reportes - CARGADA');
} catch (error) {
  console.log('❌ /api/reportes - ERROR:', error.message);
}

// ✅ RUTAS DE PRUEBA SIN AUTENTICACIÓN (AGREGA ESTO)
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ Ruta de prueba funciona!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const pool = require('./config/database');
    const result = await pool.query('SELECT NOW() as current_time');
    res.json({ 
      message: '✅ Conexión a BD funciona!',
      database_time: result.rows[0].current_time
    });
  } catch (error) {
    res.status(500).json({ error: '❌ Error en BD: ' + error.message });
  }
});

// Ruta de verificación de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Sistema de Asistencias Municipalidad SJB - API funcionando',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error del servidor:', err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Contacte al administrador'
  });
});

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📍 Sistema de Asistencias - Municipalidad Distrital SJB`);
  console.log(`📊 Modo: ${process.env.NODE_ENV || 'development'}`);
});