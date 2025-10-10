// src/models/Rubrica.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rubrica = sequelize.define('Rubrica', {
  id_rubrica: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_rubrica'
  },
  nombre_rubrica: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'nombre_rubrica'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'descripcion'
  },
  puntuacion_maxima: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    field: 'puntuacion_maxima'
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'rubrica',
  schema: 'evaluaciones',
  timestamps: false
});

module.exports = Rubrica;
