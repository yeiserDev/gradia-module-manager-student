// src/models/associations.js - VISTA ESTUDIANTE
// ================================================
// Solo incluye las relaciones necesarias para estudiantes
// MIGRACIÓN SIN SESIONES - Actividad conecta directamente con Unidad

const Curso = require('./Curso');
const Unidad = require('./Unidad');
const Actividad = require('./Actividad');
const Entrega = require('./Entrega');
const ArchivoEntrega = require('./ArchivoEntrega');
const Comentario = require('./Comentario');
const DocumentoActividad = require('./DocumentoActividad');
const Grupo = require('./Grupo');
const MiembroGrupo = require('./MiembroGrupo');
const Evaluacion = require('./Evaluacion');
const DetalleEvaluacion = require('./DetalleEvaluacion');
const Rubrica = require('./Rubrica');
const Criterio = require('./Criterio');
const NivelCriterio = require('./NivelCriterio');
const RubricaCriterio = require('./RubricaCriterio');
const Inscripcion = require('./Inscripcion');

// Modelos de Usuario (READ ONLY - tabla compartida con auth_gradia)
// Necesarios para mostrar quién hizo el comentario
const Usuario = require('./Usuario');
const Persona = require('./Persona');

// ==========================================
// RELACIONES DE INSCRIPCIÓN
// ==========================================

// Usuario-Curso a través de Inscripcion (relación N:M)
Curso.hasMany(Inscripcion, {
  foreignKey: 'id_curso',
  as: 'inscripciones'
});
Inscripcion.belongsTo(Curso, {
  foreignKey: 'id_curso',
  as: 'curso'
});

Inscripcion.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario'
});
Usuario.hasMany(Inscripcion, {
  foreignKey: 'id_usuario',
  as: 'inscripciones'
});

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
// RELACIONES DE COMENTARIOS
// ==========================================

// Entrega -> Comentario
Entrega.hasMany(Comentario, {
  foreignKey: 'id_entrega',
  as: 'comentarios'
});
Comentario.belongsTo(Entrega, {
  foreignKey: 'id_entrega',
  as: 'entrega'
});

// Actividad -> Comentario
Actividad.hasMany(Comentario, {
  foreignKey: 'id_actividad',
  as: 'comentarios'
});
Comentario.belongsTo(Actividad, {
  foreignKey: 'id_actividad',
  as: 'actividad'
});

// Usuario -> Comentario
Usuario.hasMany(Comentario, {
  foreignKey: 'id_usuario',
  as: 'comentarios'
});
Comentario.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario'
});

// Comentario -> Comentario (Respuestas)
Comentario.hasMany(Comentario, {
  foreignKey: 'parent_id',
  as: 'respuestas'
});
Comentario.belongsTo(Comentario, {
  foreignKey: 'parent_id',
  as: 'padre'
});

// ==========================================
// RELACIONES DE USUARIO
// ==========================================

// Usuario -> Persona
Usuario.belongsTo(Persona, {
  foreignKey: 'id_persona',
  as: 'persona'
});
Persona.hasOne(Usuario, {
  foreignKey: 'id_persona',
  as: 'usuario'
});

// ==========================================
// RELACIONES DE MATERIALES
// ==========================================

// Actividad → DocumentoActividad (Una actividad puede tener muchos materiales)
Actividad.hasMany(DocumentoActividad, {
  foreignKey: 'id_actividad',
  as: 'materiales'
});
DocumentoActividad.belongsTo(Actividad, {
  foreignKey: 'id_actividad',
  as: 'actividad'
});

// ==========================================
// RELACIONES DE GRUPOS
// ==========================================

// Actividad → Grupo (Una actividad puede tener muchos grupos)
Actividad.hasMany(Grupo, {
  foreignKey: 'id_actividad',
  as: 'grupos'
});
Grupo.belongsTo(Actividad, {
  foreignKey: 'id_actividad',
  as: 'actividad'
});

// Grupo → MiembroGrupo (Un grupo puede tener muchos miembros)
Grupo.hasMany(MiembroGrupo, {
  foreignKey: 'id_grupo',
  as: 'miembros'
});
MiembroGrupo.belongsTo(Grupo, {
  foreignKey: 'id_grupo',
  as: 'grupo'
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
  Comentario,
  DocumentoActividad,
  Grupo,
  MiembroGrupo,
  Evaluacion,
  DetalleEvaluacion,
  Rubrica,
  Criterio,
  NivelCriterio,
  RubricaCriterio,
  Inscripcion,
  Usuario,
  Persona
};