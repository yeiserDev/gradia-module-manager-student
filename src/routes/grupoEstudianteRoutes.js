// src/routes/grupoEstudianteRoutes.js
// =====================================
// Rutas para el módulo de GRUPOS - Vista Estudiante

const express = require('express');
const router = express.Router();
const {
  getMisGrupos,
  getDetalleGrupo,
  getGruposPorActividad
} = require('../controllers/grupoEstudianteController');

// ==========================================
// RUTAS DE GRUPOS
// ==========================================

// GET - Obtener todos mis grupos
router.get('/', getMisGrupos);

// GET - Obtener grupos de una actividad específica
router.get('/actividad/:actividadId', getGruposPorActividad);

// GET - Obtener detalle de un grupo específico
router.get('/:grupoId', getDetalleGrupo);

module.exports = router;
