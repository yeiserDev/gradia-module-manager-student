const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comentario = sequelize.define('Comentario', {
  id_comentario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_comentario'
  },
  id_entrega: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_entrega'
  },
  id_actividad: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_actividad'
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario'
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'contenido'
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'parent_id'
  }
}, {
  tableName: 'comentario',
  schema: 'actividades',
  timestamps: false
});

module.exports = Comentario;
