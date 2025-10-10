// app.js - VISTA ESTUDIANTE
// ========================

const express = require('express');
const cors = require('cors');
const path = require('path');
const { testConnection } = require('./src/config/database');

// 🔧 IMPORTANTE: Importar relaciones ANTES que las rutas
require('./src/models/associations');

// Importar rutas
const cursoEstudianteRoutes = require('./src/routes/cursoEstudianteRoutes');
const entregaEstudianteRoutes = require('./src/routes/entregaEstudianteRoutes');
const evaluacionEstudianteRoutes = require('./src/routes/evaluacionEstudianteRoutes');

const app = express();
const PORT = process.env.PORT || 3001; // Puerto diferente al docente (3000)

// ==========================================
// MIDDLEWARES BÁSICOS
// ==========================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (para cuando implementemos upload)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware para logging de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ==========================================
// RUTAS PRINCIPALES
// ==========================================

// Rutas para estudiantes
app.use('/api/student/cursos', cursoEstudianteRoutes);
app.use('/api/student/entregas', entregaEstudianteRoutes);
app.use('/api/student/evaluaciones', evaluacionEstudianteRoutes);

// ==========================================
// RUTAS BÁSICAS
// ==========================================

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'API de GradIA - Vista Estudiante',
    version: '1.0.0',
    status: 'Configuración inicial completada',
    endpoints: {
      health: '/api/health',
      mis_cursos: '/api/student/cursos',
      actividades_pendientes: '/api/student/cursos/actividades/pendientes',
      mis_entregas: '/api/student/entregas',
      dashboard: '/api/student/entregas/dashboard'
    }
  });
});

// Ruta para verificar la conexión a la base de datos
app.get('/api/health', async (req, res) => {
  try {
    await require('./src/config/database').authenticate();
    res.json({
      status: 'OK',
      database: 'Connected',
      message: 'Vista Estudiante - Conexión exitosa',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      database: 'Disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ==========================================
// MIDDLEWARE PARA ERRORES
// ==========================================

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada en vista estudiante'
  });
});

// Middleware global para manejo de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
  });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    await testConnection();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🎓 VISTA ESTUDIANTE - Servidor corriendo en puerto ${PORT}`);
      console.log(`📚 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌐 Base URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;