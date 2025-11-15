// src/routes/entregaEstudianteRoutes.js
const express = require('express');
const router = express.Router();
const entregaEstudianteController = require('../controllers/entregaEstudianteController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

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

// Crear nueva entrega (ENVIAR TAREA)
router.post('/', entregaEstudianteController.createEntrega);

// Obtener detalle de UNA entrega específica MÍA
router.get('/:entregaId', entregaEstudianteController.getDetalleEntrega);

// Actualizar entrega existente (NUEVO INTENTO)
router.put('/:entregaId', entregaEstudianteController.updateEntrega);

// Eliminar mi entrega (solo antes de fecha límite)
router.delete('/:entregaId', entregaEstudianteController.deleteEntrega);

module.exports = router;