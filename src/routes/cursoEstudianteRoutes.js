// src/routes/cursoEstudianteRoutes.js
const express = require('express');
const router = express.Router();
const cursoEstudianteController = require('../controllers/cursoEstudianteController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

// 🔒 Todas las rutas requieren autenticación y rol ESTUDIANTE
router.use(authenticate);
router.use(authorize(['ESTUDIANTE', 'ADMIN']));

// ==========================================
// RUTAS PARA VISTA DE CURSOS - ESTUDIANTE
// ==========================================

// Obtener todos mis cursos
router.get('/', cursoEstudianteController.getMisCursos);

// Obtener actividades pendientes de todos los cursos
router.get('/actividades/pendientes', cursoEstudianteController.getActividadesPendientes);

// Obtener detalle de un curso específico
router.get('/:cursoId', cursoEstudianteController.getDetalleCurso);

// Obtener todas las actividades de un curso específico
router.get('/:cursoId/actividades', cursoEstudianteController.getActividadesPorCurso);

module.exports = router;