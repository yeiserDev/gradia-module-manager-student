// src/routes/comentarioEstudianteRoutes.js
// =========================================
// Rutas para el módulo de COMENTARIOS - Vista Estudiante

const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const {
  getComentariosPorEntrega,
  getMisComentarios
} = require('../controllers/comentarioEstudianteController');

// 🔒 Todas las rutas requieren autenticación y rol ESTUDIANTE
router.use(authenticate);
router.use(authorize(['ESTUDIANTE', 'ADMIN']));

// ==========================================
// RUTAS DE COMENTARIOS
// ==========================================

// GET - Obtener todos los comentarios del estudiante
router.get('/', getMisComentarios);

// GET - Obtener comentarios de una entrega específica
router.get('/entrega/:entregaId', getComentariosPorEntrega);

module.exports = router;
