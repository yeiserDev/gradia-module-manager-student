// src/models/MiembroGrupo.js
// ===========================
// Modelo MiembroGrupo - Miembros de cada grupo

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MiembroGrupo = sequelize.define('MiembroGrupo', {
  id_miembro: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_miembro'
  },
  id_grupo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_grupo',
    references: {
      model: 'grupo',
      key: 'id_grupo'
    }
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario',
    references: {
      model: 'usuario',
      key: 'id_usuario'
    }
  }
}, {
  tableName: 'miembro_grupo',
  schema: 'grupos',
  timestamps: false
});

module.exports = MiembroGrupo;
