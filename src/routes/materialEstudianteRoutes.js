// src/routes/materialEstudianteRoutes.js
// ========================================
// Rutas para el módulo de MATERIALES - Vista Estudiante

const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const {
  getMaterialesPorActividad,
  getDetalleMaterial,
  getMaterialesPorCurso
} = require('../controllers/materialEstudianteController');

// 🔒 Todas las rutas requieren autenticación y rol ESTUDIANTE
router.use(authenticate);
router.use(authorize(['ESTUDIANTE', 'ADMIN']));

// ==========================================
// RUTAS DE MATERIALES
// ==========================================

// GET - Obtener materiales de una actividad específica
router.get('/actividad/:actividadId', getMaterialesPorActividad);

// GET - Obtener detalle de un material específico
router.get('/:materialId', getDetalleMaterial);

// GET - Obtener todos los materiales de un curso
router.get('/curso/:cursoId', getMaterialesPorCurso);

module.exports = router;
