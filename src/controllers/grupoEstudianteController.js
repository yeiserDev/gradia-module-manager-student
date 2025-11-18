// src/controllers/grupoEstudianteController.js
// =============================================
// Controlador para gestión de GRUPOS - Vista Estudiante

const { Grupo, MiembroGrupo, Actividad, Unidad, Curso } = require('../models/associations');
const { Op } = require('sequelize');

// ==========================================
// GET - Obtener todos mis grupos
// ==========================================
const getMisGrupos = async (req, res) => {
  try {
    const usuarioId = req.user.id; // Usuario autenticado desde JWT

    // Obtener todos los grupos donde el estudiante es miembro
    const miembros = await MiembroGrupo.findAll({
      where: { id_usuario: usuarioId },
      include: [{
        model: Grupo,
        as: 'grupo',
        include: [
          {
            model: Actividad,
            as: 'actividad',
            attributes: ['id_actividad', 'nombre_actividad', 'tipo_actividad', 'fecha_limite'],
            include: [{
              model: Unidad,
              as: 'unidad',
              attributes: ['id_unidad', 'titulo_unidad'],
              include: [{
                model: Curso,
                as: 'curso',
                attributes: ['id_curso', 'nombre_curso']
              }]
            }]
          },
          {
            model: MiembroGrupo,
            as: 'miembros',
            attributes: ['id_miembro', 'id_usuario']
          }
        ]
      }],
      order: [[{ model: Grupo, as: 'grupo' }, 'id_grupo', 'DESC']]
    });

    // Formatear la respuesta
    const grupos = miembros.map(miembro => {
      const grupo = miembro.grupo;
      return {
        id_grupo: grupo.id_grupo,
        nombre_grupo: grupo.nombre_grupo,
        total_miembros: grupo.miembros.length,
        actividad: grupo.actividad,
        miembros: grupo.miembros
      };
    });

    res.status(200).json({
      success: true,
      data: grupos,
      message: 'Grupos obtenidos exitosamente'
    });

  } catch (error) {
    console.error('Error al obtener mis grupos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// ==========================================
// GET - Obtener detalle de un grupo
// ==========================================
const getDetalleGrupo = async (req, res) => {
  try {
    const { grupoId } = req.params;
    const usuarioId = req.user.id; // Usuario autenticado desde JWT

    // Verificar que el grupo existe
    const grupo = await Grupo.findByPk(grupoId, {
      include: [
        {
          model: Actividad,
          as: 'actividad',
          include: [{
            model: Unidad,
            as: 'unidad',
            include: [{
              model: Curso,
              as: 'curso'
            }]
          }]
        },
        {
          model: MiembroGrupo,
          as: 'miembros',
          attributes: ['id_miembro', 'id_usuario']
        }
      ]
    });

    if (!grupo) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado'
      });
    }

    // Verificar que el estudiante es miembro del grupo
    const esMiembro = grupo.miembros.some(m => m.id_usuario === parseInt(usuarioId));
    if (!esMiembro) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver este grupo'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...grupo.toJSON(),
        total_miembros: grupo.miembros.length
      },
      message: 'Detalle del grupo obtenido exitosamente'
    });

  } catch (error) {
    console.error('Error al obtener detalle del grupo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// ==========================================
// GET - Obtener grupos de una actividad
// ==========================================
const getGruposPorActividad = async (req, res) => {
  try {
    const { actividadId } = req.params;

    // Validar que la actividad existe
    const actividad = await Actividad.findByPk(actividadId);
    if (!actividad) {
      return res.status(404).json({
        success: false,
        message: 'Actividad no encontrada'
      });
    }

    // Obtener todos los grupos de la actividad
    const grupos = await Grupo.findAll({
      where: { id_actividad: actividadId },
      include: [{
        model: MiembroGrupo,
        as: 'miembros',
        attributes: ['id_miembro', 'id_usuario']
      }],
      order: [['id_grupo', 'ASC']]
    });

    // Formatear respuesta
    const gruposFormateados = grupos.map(grupo => ({
      id_grupo: grupo.id_grupo,
      nombre_grupo: grupo.nombre_grupo,
      total_miembros: grupo.miembros.length,
      miembros: grupo.miembros
    }));

    res.status(200).json({
      success: true,
      data: {
        actividad: {
          id_actividad: actividad.id_actividad,
          nombre_actividad: actividad.nombre_actividad,
          tipo_actividad: actividad.tipo_actividad
        },
        total_grupos: gruposFormateados.length,
        grupos: gruposFormateados
      },
      message: 'Grupos de la actividad obtenidos exitosamente'
    });

  } catch (error) {
    console.error('Error al obtener grupos de la actividad:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getMisGrupos,
  getDetalleGrupo,
  getGruposPorActividad
};
