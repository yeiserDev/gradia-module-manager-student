// src/controllers/materialEstudianteController.js
// ================================================
// Controlador para gestión de MATERIALES - Vista Estudiante

const { DocumentoActividad, Actividad, Unidad, Curso } = require('../models/associations');

// ==========================================
// GET - Obtener materiales de una actividad
// ==========================================
const getMaterialesPorActividad = async (req, res) => {
  try {
    const { actividadId } = req.params;

    // 1. Validar que la actividad existe
    const actividad = await Actividad.findByPk(actividadId);
    if (!actividad) {
      return res.status(404).json({
        success: false,
        message: 'Actividad no encontrada'
      });
    }

    // 2. Obtener materiales de la actividad
    const materiales = await DocumentoActividad.findAll({
      where: { id_actividad: actividadId },
      attributes: [
        'id_documento_actividad',
        'nombre_documento',
        'url_archivo',
        'tipo_documento',
        'id_actividad',
        'created_at'
      ],
      order: [['created_at', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: materiales,
      message: 'Materiales obtenidos exitosamente'
    });

  } catch (error) {
    console.error('Error al obtener materiales de la actividad:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// ==========================================
// GET - Obtener un material específico por ID
// ==========================================
const getDetalleMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;

    const material = await DocumentoActividad.findByPk(materialId, {
      include: [{
        model: Actividad,
        as: 'actividad',
        attributes: ['id_actividad', 'nombre_actividad', 'descripcion'],
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
      }]
    });

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: material,
      message: 'Detalle del material obtenido exitosamente'
    });

  } catch (error) {
    console.error('Error al obtener detalle del material:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// ==========================================
// GET - Obtener todos los materiales de un curso
// ==========================================
const getMaterialesPorCurso = async (req, res) => {
  try {
    const { cursoId } = req.params;

    // 1. Validar que el curso existe
    const curso = await Curso.findByPk(cursoId);
    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // 2. Obtener todas las actividades del curso con sus materiales
    const actividades = await Actividad.findAll({
      include: [
        {
          model: Unidad,
          as: 'unidad',
          where: { id_curso: cursoId },
          attributes: ['id_unidad', 'titulo_unidad', 'numero_unidad']
        },
        {
          model: DocumentoActividad,
          as: 'materiales',
          attributes: [
            'id_documento_actividad',
            'nombre_documento',
            'url_archivo',
            'tipo_documento',
            'id_actividad',
            'created_at'
          ]
        }
      ],
      attributes: ['id_actividad', 'nombre_actividad'],
      order: [
        [{ model: Unidad, as: 'unidad' }, 'numero_unidad', 'ASC'],
        [{ model: DocumentoActividad, as: 'materiales' }, 'created_at', 'ASC']
      ]
    });

    // 3. Filtrar solo actividades que tienen materiales
    const actividadesConMateriales = actividades
      .filter(act => act.materiales && act.materiales.length > 0)
      .map(act => ({
        id_actividad: act.id_actividad,
        nombre_actividad: act.nombre_actividad,
        unidad: act.unidad,
        total_materiales: act.materiales.length,
        materiales: act.materiales
      }));

    res.status(200).json({
      success: true,
      data: {
        curso: {
          id_curso: curso.id_curso,
          nombre_curso: curso.nombre_curso
        },
        total_actividades_con_materiales: actividadesConMateriales.length,
        actividades: actividadesConMateriales
      },
      message: 'Materiales del curso obtenidos exitosamente'
    });

  } catch (error) {
    console.error('Error al obtener materiales del curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getMaterialesPorActividad,
  getDetalleMaterial,
  getMaterialesPorCurso
};
