// src/models/Criterio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Criterio = sequelize.define('Criterio', {
  id_criterio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_criterio'
  },
  nombre_criterio: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'nombre_criterio'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'descripcion'
  },
  peso: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    field: 'peso'
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
  tableName: 'criterio',
  schema: 'evaluaciones',
  timestamps: false
});

module.exports = Criterio;
