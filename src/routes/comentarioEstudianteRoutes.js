// src/routes/comentarioEstudianteRoutes.js
// =========================================
// Rutas para el módulo de COMENTARIOS - Vista Estudiante

const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const {
  getComentariosByActividad,
  createComentario,
  deleteComentario,
  getComentariosPorEntrega,
  getMisComentarios
} = require('../controllers/comentarioEstudianteController');

// 🔒 Todas las rutas requieren autenticación y rol ESTUDIANTE
router.use(authenticate);
router.use(authorize(['ESTUDIANTE', 'ADMIN']));

// ==========================================
// RUTAS DE COMENTARIOS
// ==========================================

// Rutas principales (CRUD)
router.get('/actividad/:actividadId', getComentariosByActividad);
router.post('/', createComentario);
router.delete('/:id', deleteComentario);

// Rutas legacy/específicas
router.get('/', getMisComentarios);
router.get('/entrega/:entregaId', getComentariosPorEntrega);

module.exports = router;
