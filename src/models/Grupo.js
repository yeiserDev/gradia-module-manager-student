// src/models/Grupo.js
// ====================
// Modelo Grupo - Grupos para actividades grupales

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Grupo = sequelize.define('Grupo', {
  id_grupo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_grupo'
  },
  id_actividad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_actividad',
    references: {
      model: 'actividad',
      key: 'id_actividad'
    }
  },
  nombre_grupo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nombre_grupo'
  }
}, {
  tableName: 'grupo',
  schema: 'grupos',
  timestamps: false
});

module.exports = Grupo;
