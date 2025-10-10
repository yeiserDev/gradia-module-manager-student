// src/models/NivelCriterio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NivelCriterio = sequelize.define('NivelCriterio', {
  id_nivel_criterio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_nivel_criterio'
  },
  id_criterio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_criterio'
  },
  nombre_nivel: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nombre_nivel'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'descripcion'
  },
  puntuacion: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    field: 'puntuacion'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'nivel_criterio',
  schema: 'evaluaciones',
  timestamps: false
});

module.exports = NivelCriterio;
