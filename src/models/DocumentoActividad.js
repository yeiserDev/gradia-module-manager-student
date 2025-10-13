// src/models/DocumentoActividad.js
// ====================================
// Modelo DocumentoActividad - Materiales de apoyo de actividades

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DocumentoActividad = sequelize.define('DocumentoActividad', {
  id_documento_actividad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_documento_actividad'
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
  nombre_documento: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'nombre_documento'
  },
  url_archivo: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'url_archivo'
  },
  tipo_documento: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'tipo_documento'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'documento_actividad',
  schema: 'actividades',
  timestamps: false
});

module.exports = DocumentoActividad;
