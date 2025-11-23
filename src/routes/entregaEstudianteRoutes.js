// src/routes/entregaEstudianteRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const entregaEstudianteController = require('../controllers/entregaEstudianteController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

// Configurar almacenamiento de multer para entregas
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/submissions');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, uniqueSuffix + '_' + nameWithoutExt + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // Límite de 100MB para entregas
  }
});

// 🔒 Todas las rutas requieren autenticación y rol ESTUDIANTE
router.use(authenticate);
router.use(authorize(['ESTUDIANTE', 'ADMIN']));

// ==========================================
// RUTAS PARA ENTREGAS - ESTUDIANTE
// ==========================================

// Dashboard personal del estudiante
router.get('/dashboard', entregaEstudianteController.getDashboardEstudiante);

// Obtener todas MIS entregas
router.get('/', entregaEstudianteController.getMisEntregas);

// Obtener MI entrega para una actividad específica
router.get('/actividad/:actividadId', entregaEstudianteController.getEntregaPorActividad);

// Crear nueva entrega (ENVIAR TAREA) - Ahora con soporte de archivos
router.post('/', upload.array('files', 10), entregaEstudianteController.createEntrega);

// Obtener detalle de UNA entrega específica MÍA
router.get('/:entregaId', entregaEstudianteController.getDetalleEntrega);

// Actualizar entrega existente (NUEVO INTENTO)
router.put('/:entregaId', entregaEstudianteController.updateEntrega);

// Eliminar mi entrega (solo antes de fecha límite)
router.delete('/:entregaId', entregaEstudianteController.deleteEntrega);

module.exports = router;