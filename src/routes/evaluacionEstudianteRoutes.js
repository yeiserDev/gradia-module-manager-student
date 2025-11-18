// src/routes/evaluacionEstudianteRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const evaluacionEstudianteController = require('../controllers/evaluacionEstudianteController');

// 🔒 Todas las rutas requieren autenticación y rol ESTUDIANTE
router.use(authenticate);
router.use(authorize(['ESTUDIANTE', 'ADMIN']));

// ==========================================
// RUTAS PARA EVALUACIONES - ESTUDIANTE
// ==========================================

// Estadísticas de evaluaciones (debe ir antes de /:entregaId)
router.get('/estadisticas', evaluacionEstudianteController.getEstadisticasEvaluaciones);

// Historial de todas mis calificaciones
router.get('/mis-calificaciones', evaluacionEstudianteController.getMisCalificaciones);

// Ver rúbrica de una actividad
router.get('/rubrica/:actividadId', evaluacionEstudianteController.getRubricaByActividad);

// Ver evaluación de una entrega específica
router.get('/:entregaId', evaluacionEstudianteController.getEvaluacionByEntrega);

module.exports = router;
