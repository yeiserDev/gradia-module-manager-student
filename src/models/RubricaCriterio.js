// src/models/RubricaCriterio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RubricaCriterio = sequelize.define('RubricaCriterio', {
  id_rubrica_criterio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_rubrica_criterio'
  },
  id_rubrica: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_rubrica'
  },
  id_criterio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_criterio'
  },
  orden: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'orden'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'rubrica_criterio',
  schema: 'evaluaciones',
  timestamps: false
});

module.exports = RubricaCriterio;
