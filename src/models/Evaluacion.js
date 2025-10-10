// src/models/Evaluacion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Evaluacion = sequelize.define('Evaluacion', {
  id_evaluacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_evaluacion'
  },
  id_entrega: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_entrega'
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario'
  },
  puntuacion_total: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    field: 'puntuacion_total'
  },
  comentarios: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'comentarios'
  },
  fecha_evaluacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'fecha_evaluacion'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'evaluacion',
  schema: 'evaluaciones',
  timestamps: false
});

module.exports = Evaluacion;
