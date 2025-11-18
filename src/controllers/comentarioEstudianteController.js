// src/controllers/comentarioEstudianteController.js
// MÓDULO: COMENTARIOS - Vista Estudiante
// ========================================
// Permite a los estudiantes ver comentarios de docentes en sus entregas

const { Comentario, Entrega, Actividad, Unidad, Curso } = require('../models/associations');

// ==========================================
// 1. GET COMENTARIOS DE UNA ENTREGA ESPECÍFICA
// ==========================================
/**
 * @route   GET /api/student/comentarios/entrega/:entregaId
 * @desc    Obtener todos los comentarios de una entrega del estudiante
 * @access  Student (simulado con usuarioId)
 */
const getComentariosPorEntrega = async (req, res) => {
  try {
    const { entregaId } = req.params;
    const usuarioId = req.user.id; // Usuario autenticado desde JWT

    // Validar que entregaId sea un número
    if (isNaN(entregaId)) {
      return res.status(400).json({
        success: false,
        message: 'El ID de la entrega debe ser un número válido'
      });
    }

    // 1. Verificar que la entrega existe
    const entrega = await Entrega.findByPk(entregaId);

    if (!entrega) {
      return res.status(404).json({
        success: false,
        message: 'Entrega no encontrada'
      });
    }

    // 2. Validar que la entrega pertenece al estudiante
    if (entrega.id_usuario !== parseInt(usuarioId)) {
      return res.status(404).json({
        success: false,
        message: 'No tienes permisos para ver los comentarios de esta entrega'
      });
    }

    // 3. Obtener comentarios de la entrega
    const comentarios = await Comentario.findAll({
      where: { id_entrega: entregaId },
      order: [['fecha_comentario', 'DESC']], // Más recientes primero
      attributes: [
        'id_comentario',
        'id_entrega',
        'id_usuario',
        'contenido',
        'fecha_comentario'
      ]
    });

    res.status(200).json({
      success: true,
      data: {
        id_entrega: entrega.id_entrega,
        total_comentarios: comentarios.length,
        comentarios: comentarios
      },
      message: 'Comentarios de la entrega obtenidos exitosamente'
    });

  } catch (error) {
    console.error('Error al obtener comentarios de entrega:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// ==========================================
// 2. GET TODOS LOS COMENTARIOS DEL ESTUDIANTE
// ==========================================
/**
 * @route   GET /api/student/comentarios
 * @desc    Obtener todos los comentarios recibidos por el estudiante
 * @access  Student (simulado con usuarioId)
 */
const getMisComentarios = async (req, res) => {
  try {
    const usuarioId = req.user.id; // Usuario autenticado desde JWT

    // 1. Obtener todas las entregas del estudiante con sus comentarios
    const entregas = await Entrega.findAll({
      where: { id_usuario: usuarioId },
      include: [
        {
          model: Comentario,
          as: 'comentarios',
          required: false, // LEFT JOIN - incluir entregas sin comentarios
          attributes: [
            'id_comentario',
            'id_usuario',
            'contenido',
            'fecha_comentario'
          ]
        },
        {
          model: Actividad,
          as: 'actividad',
          attributes: ['id_actividad', 'nombre_actividad', 'id_unidad'],
          include: [
            {
              model: Unidad,
              as: 'unidad',
              attributes: ['id_unidad', 'titulo_unidad', 'id_curso'],
              include: [
                {
                  model: Curso,
                  as: 'curso',
                  attributes: ['id_curso', 'nombre_curso']
                }
              ]
            }
          ]
        }
      ],
      order: [
        ['fecha_entrega', 'DESC'],
        [{ model: Comentario, as: 'comentarios' }, 'fecha_comentario', 'DESC']
      ]
    });

    // 2. Aplanar los comentarios y agregar contexto
    const comentariosConContexto = [];
    let totalComentarios = 0;

    entregas.forEach(entrega => {
      if (entrega.comentarios && entrega.comentarios.length > 0) {
        entrega.comentarios.forEach(comentario => {
          comentariosConContexto.push({
            // Información del comentario
            id_comentario: comentario.id_comentario,
            contenido: comentario.contenido,
            fecha_comentario: comentario.fecha_comentario,
            id_usuario_docente: comentario.id_usuario,

            // Contexto de la entrega
            entrega: {
              id_entrega: entrega.id_entrega,
              fecha_entrega: entrega.fecha_entrega,
              num_intento: entrega.num_intento
            },

            // Contexto de la actividad y curso
            actividad: {
              id_actividad: entrega.actividad.id_actividad,
              nombre_actividad: entrega.actividad.nombre_actividad
            },

            curso: {
              id_curso: entrega.actividad.unidad.curso.id_curso,
              nombre_curso: entrega.actividad.unidad.curso.nombre_curso
            }
          });
          totalComentarios++;
        });
      }
    });

    // 3. Calcular estadísticas
    const estadisticas = {
      total_comentarios: totalComentarios,
      entregas_con_comentarios: entregas.filter(e => e.comentarios && e.comentarios.length > 0).length,
      total_entregas: entregas.length,
      comentarios_esta_semana: comentariosConContexto.filter(c => {
        const fechaComentario = new Date(c.fecha_comentario);
        const haceUnaSemana = new Date();
        haceUnaSemana.setDate(haceUnaSemana.getDate() - 7);
        return fechaComentario >= haceUnaSemana;
      }).length
    };

    res.status(200).json({
      success: true,
      data: {
        comentarios: comentariosConContexto,
        estadisticas
      },
      message: 'Todos los comentarios obtenidos exitosamente'
    });

  } catch (error) {
    console.error('Error al obtener todos los comentarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// ==========================================
// EXPORTAR CONTROLADORES
// ==========================================
module.exports = {
  getComentariosPorEntrega,
  getMisComentarios
};
