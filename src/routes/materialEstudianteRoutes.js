// src/routes/materialEstudianteRoutes.js
// ========================================
// Rutas para el módulo de MATERIALES - Vista Estudiante

const express = require('express');
const router = express.Router();
const {
  getMaterialesPorActividad,
  getDetalleMaterial,
  getMaterialesPorCurso
} = require('../controllers/materialEstudianteController');

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
