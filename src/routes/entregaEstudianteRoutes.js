// src/routes/entregaEstudianteRoutes.js
const express = require('express');
const router = express.Router();

const entregaEstudianteController = require('../controllers/entregaEstudianteController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

// Multer configurado en memoria (para subir a S3)
const upload = require("../middlewares/uploadMiddleware");

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

// Crear nueva entrega (ENVIAR TAREA) - Solo 1 archivo REAL => req.file
router.post('/', upload.single('archivo'), entregaEstudianteController.createEntrega);

// Obtener detalle de UNA entrega específica MÍA
router.get('/:entregaId', entregaEstudianteController.getDetalleEntrega);

// Actualizar entrega existente (permitido solo si no hay video)
router.put('/:entregaId', upload.single('archivo'), entregaEstudianteController.updateEntrega);

// Eliminar mi entrega (solo antes de fecha límite y si NO tiene video)
router.delete('/:entregaId', entregaEstudianteController.deleteEntrega);

module.exports = router;
