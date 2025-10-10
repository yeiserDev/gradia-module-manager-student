// src/models/DetalleEvaluacion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DetalleEvaluacion = sequelize.define('DetalleEvaluacion', {
  id_detalle_evaluacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_detalle_evaluacion'
  },
  id_evaluacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_evaluacion'
  },
  id_criterio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_criterio'
  },
  id_nivel_criterio: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_nivel_criterio'
  },
  puntuacion: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    field: 'puntuacion'
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'comentario'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'detalle_evaluacion',
  schema: 'evaluaciones',
  timestamps: false
});

module.exports = DetalleEvaluacion;
