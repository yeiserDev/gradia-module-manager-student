// src/models/associations.js - VISTA ESTUDIANTE
// ================================================
// Solo incluye las relaciones necesarias para estudiantes
// MIGRACIÓN SIN SESIONES - Actividad conecta directamente con Unidad

const Curso = require('./Curso');
const Unidad = require('./Unidad');
const Actividad = require('./Actividad');
const Entrega = require('./Entrega');
const ArchivoEntrega = require('./ArchivoEntrega');
const Evaluacion = require('./Evaluacion');
const DetalleEvaluacion = require('./DetalleEvaluacion');
const Rubrica = require('./Rubrica');
const Criterio = require('./Criterio');
const NivelCriterio = require('./NivelCriterio');
const RubricaCriterio = require('./RubricaCriterio');

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

// Unidad → Actividad (SIN SESIONES - Conexión directa)
Unidad.hasMany(Actividad, {
  foreignKey: 'id_unidad',
  as: 'actividades'
});
Actividad.belongsTo(Unidad, {
  foreignKey: 'id_unidad',
  as: 'unidad'
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
// RELACIONES DE EVALUACIONES
// ==========================================

// Entrega → Evaluacion
Entrega.hasOne(Evaluacion, {
  foreignKey: 'id_entrega',
  as: 'evaluacion'
});
Evaluacion.belongsTo(Entrega, {
  foreignKey: 'id_entrega',
  as: 'entrega'
});

// Evaluacion → DetalleEvaluacion
Evaluacion.hasMany(DetalleEvaluacion, {
  foreignKey: 'id_evaluacion',
  as: 'detalles'
});
DetalleEvaluacion.belongsTo(Evaluacion, {
  foreignKey: 'id_evaluacion',
  as: 'evaluacion'
});

// Actividad → Rubrica
Actividad.belongsTo(Rubrica, {
  foreignKey: 'id_rubrica',
  as: 'rubrica'
});
Rubrica.hasMany(Actividad, {
  foreignKey: 'id_rubrica',
  as: 'actividades'
});

// Rubrica ↔ Criterio (relación N:M a través de RubricaCriterio)
Rubrica.belongsToMany(Criterio, {
  through: RubricaCriterio,
  foreignKey: 'id_rubrica',
  otherKey: 'id_criterio',
  as: 'criterios'
});
Criterio.belongsToMany(Rubrica, {
  through: RubricaCriterio,
  foreignKey: 'id_criterio',
  otherKey: 'id_rubrica',
  as: 'rubricas'
});

// Criterio → NivelCriterio
Criterio.hasMany(NivelCriterio, {
  foreignKey: 'id_criterio',
  as: 'niveles'
});
NivelCriterio.belongsTo(Criterio, {
  foreignKey: 'id_criterio',
  as: 'criterio'
});

// DetalleEvaluacion → Criterio
DetalleEvaluacion.belongsTo(Criterio, {
  foreignKey: 'id_criterio',
  as: 'criterio'
});

// DetalleEvaluacion → NivelCriterio
DetalleEvaluacion.belongsTo(NivelCriterio, {
  foreignKey: 'id_nivel_criterio',
  as: 'nivel'
});

// ==========================================
// EXPORTAR MODELOS CONFIGURADOS
// ==========================================
module.exports = {
  Curso,
  Unidad,
  Actividad,
  Entrega,
  ArchivoEntrega,
  Evaluacion,
  DetalleEvaluacion,
  Rubrica,
  Criterio,
  NivelCriterio,
  RubricaCriterio
};