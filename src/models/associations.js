// src/models/associations.js - VISTA ESTUDIANTE
// ================================================
// Solo incluye las relaciones necesarias para estudiantes

const Curso = require('./Curso');
const Unidad = require('./Unidad');
const Sesion = require('./Sesion');
const Actividad = require('./Actividad');
const Entrega = require('./Entrega');
const ArchivoEntrega = require('./ArchivoEntrega');

// ==========================================
// RELACIONES BÁSICAS DE LA JERARQUÍA
// ==========================================

// Curso → Unidad
Curso.hasMany(Unidad, {
  foreignKey: 'id_curso',
  as: 'unidades'
});
Unidad.belongsTo(Curso, {
  foreignKey: 'id_curso',
  as: 'curso'
});

// Unidad → Sesion
Unidad.hasMany(Sesion, {
  foreignKey: 'id_unidad',
  as: 'sesiones'
});
Sesion.belongsTo(Unidad, {
  foreignKey: 'id_unidad',
  as: 'unidad'
});

// Sesion → Actividad
Sesion.hasMany(Actividad, {
  foreignKey: 'id_sesion',
  as: 'actividades'
});
Actividad.belongsTo(Sesion, {
  foreignKey: 'id_sesion',
  as: 'sesion'
});

// ==========================================
// RELACIONES DE ENTREGAS (CRÍTICO PARA ESTUDIANTES)
// ==========================================

// Actividad → Entrega (Una actividad puede tener muchas entregas)
Actividad.hasMany(Entrega, {
  foreignKey: 'id_actividad',
  as: 'entregas'
});
Entrega.belongsTo(Actividad, {
  foreignKey: 'id_actividad',
  as: 'actividad'
});

// Entrega → ArchivoEntrega (Una entrega puede tener muchos archivos)
Entrega.hasMany(ArchivoEntrega, {
  foreignKey: 'id_entrega',
  as: 'archivos'
});
ArchivoEntrega.belongsTo(Entrega, {
  foreignKey: 'id_entrega',
  as: 'entrega'
});

// ==========================================
// EXPORTAR MODELOS CONFIGURADOS
// ==========================================
module.exports = {
  Curso,
  Unidad,
  Sesion,
  Actividad,
  Entrega,
  ArchivoEntrega
};