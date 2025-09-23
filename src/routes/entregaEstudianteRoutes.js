// src/routes/entregaEstudianteRoutes.js
const express = require('express');
const router = express.Router();
const entregaEstudianteController = require('../controllers/entregaEstudianteController');

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