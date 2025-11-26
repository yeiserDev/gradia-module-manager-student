// app.js - VISTA ESTUDIANTE
// ========================

// 🔑 IMPORTANTE: Cargar variables de entorno PRIMERO
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { testConnection } = require('./src/config/database');

// 🔧 IMPORTANTE: Importar relaciones ANTES que las rutas
require('./src/models/associations');

// Importar rutas
const cursoEstudianteRoutes = require('./src/routes/cursoEstudianteRoutes');
const entregaEstudianteRoutes = require('./src/routes/entregaEstudianteRoutes');
const comentarioEstudianteRoutes = require('./src/routes/comentarioEstudianteRoutes');
const evaluacionEstudianteRoutes = require('./src/routes/evaluacionEstudianteRoutes');
const materialEstudianteRoutes = require('./src/routes/materialEstudianteRoutes');
const grupoEstudianteRoutes = require('./src/routes/grupoEstudianteRoutes');

const app = express();
const PORT = process.env.PORT || 3001; // Puerto diferente al docente (3000)

// ==========================================
// MIDDLEWARES BÁSICOS
// ==========================================

// Configuración de CORS mejorada para permitir Vercel + desarrollo local
const corsOptions = {
  origin: (origin, callback) => {
    // Permitir requests sin origin (ej: Postman, mobile apps)
    if (!origin) return callback(null, true);

    // Lista de orígenes locales permitidos
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ];

    // Permitir todos los dominios de Vercel
    const isVercel = origin.endsWith('.vercel.app');

    // Permitir el dominio de producción específico (si está configurado)
    const isProduction = origin === process.env.FRONTEND_URL;

    if (allowedOrigins.includes(origin) || isVercel || isProduction) {
      return callback(null, true);
    }

    console.log('❌ ORIGEN BLOQUEADO POR CORS:', origin);
    return callback(new Error('CORS_NOT_ALLOWED'), false);
  },
  credentials: true, // Permitir cookies y headers de autenticación
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
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
app.use('/api/student/comentarios', comentarioEstudianteRoutes);
app.use('/api/student/evaluaciones', evaluacionEstudianteRoutes);
app.use('/api/student/materiales', materialEstudianteRoutes);
app.use('/api/student/grupos', grupoEstudianteRoutes);

// ==========================================
// RUTAS BÁSICAS
// ==========================================

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'API de GradIA - Vista Estudiante',
    version: '1.2.0',
    status: 'Configuración completa con materiales y grupos',
    endpoints: {
      health: '/api/health',
      mis_cursos: '/api/student/cursos',
      actividades_pendientes: '/api/student/cursos/actividades/pendientes',
      mis_entregas: '/api/student/entregas',
      dashboard: '/api/student/entregas/dashboard',
      mis_comentarios: '/api/student/comentarios',
      materiales: '/api/student/materiales',
      mis_grupos: '/api/student/grupos'
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
      console.log(`🔄 Rutas de comentarios cargadas y listas.`);
      console.log(`📚 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌐 Base URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Solo iniciar el servidor si este archivo se ejecuta directamente (no en tests)
if (require.main === module) {
  startServer();
}

module.exports = app;