// src/controllers/cursoEstudianteController.js
const { Curso, Unidad, Actividad, Entrega, Inscripcion } = require('../models/associations');
const { verificarInscripcionEnCurso } = require('../utils/inscripcionHelper');

const cursoEstudianteController = {

  // Obtener todos los cursos donde el estudiante está inscrito
  getMisCursos: async (req, res) => {
    try {
      const userId = req.user.id; // ID del estudiante autenticado desde JWT

      // Buscar cursos donde el estudiante está inscrito
      const cursos = await Curso.findAll({
        include: [
          {
            model: Inscripcion,
            as: 'inscripciones',
            where: { id_usuario: userId }, // Solo cursos donde está inscrito
            attributes: [] // No incluir datos de inscripción en respuesta
          },
          {
            model: Unidad,
            as: 'unidades',
            include: [
              {
                model: Actividad,
                as: 'actividades',
                attributes: ['id_actividad', 'nombre_actividad', 'fecha_limite', 'tipo_actividad']
              }
            ],
            attributes: ['id_unidad', 'titulo_unidad', 'numero_unidad']
          }
        ],
        attributes: ['id_curso', 'nombre_curso', 'descripcion', 'estado'],
        where: {
          estado: 'activo' // Solo cursos activos
        },
        order: [
          ['nombre_curso', 'ASC'],
          [{ model: Unidad, as: 'unidades' }, 'numero_unidad', 'ASC'],
          [{ model: Unidad, as: 'unidades' }, { model: Actividad, as: 'actividades' }, 'created_at', 'ASC']
        ]
      });

      // Calcular estadísticas por curso
      const cursosConEstadisticas = await Promise.all(
        cursos.map(async (curso) => {
          const totalActividades = await Actividad.count({
            include: [
              {
                model: Unidad,
                as: 'unidad',
                where: { id_curso: curso.id_curso }
              }
            ]
          });

          return {
            ...curso.toJSON(),
            estadisticas: {
              total_unidades: curso.unidades.length,
              total_actividades: totalActividades
            }
          };
        })
      );

      res.status(200).json({
        success: true,
        data: cursosConEstadisticas,
        message: 'Cursos obtenidos exitosamente'
      });

    } catch (error) {
      console.error('Error al obtener cursos del estudiante:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener detalle de un curso específico
  getDetalleCurso: async (req, res) => {
    try {
      const { cursoId } = req.params;
      const userId = req.user.id;

      // Verificar que el estudiante esté inscrito en el curso
      const estaInscrito = await verificarInscripcionEnCurso(userId, cursoId);

      if (!estaInscrito) {
        return res.status(403).json({
          success: false,
          message: 'No tienes acceso a este curso. Solo puedes ver cursos donde estás inscrito.'
        });
      }

      const curso = await Curso.findByPk(cursoId, {
        include: [
          {
            model: Unidad,
            as: 'unidades',
            include: [
              {
                model: Actividad,
                as: 'actividades'
              }
            ]
          }
        ],
        order: [
          [{ model: Unidad, as: 'unidades' }, 'numero_unidad', 'ASC'],
          [{ model: Unidad, as: 'unidades' }, { model: Actividad, as: 'actividades' }, 'created_at', 'ASC']
        ]
      });

      if (!curso) {
        return res.status(404).json({
          success: false,
          message: 'Curso no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: curso,
        message: 'Detalle del curso obtenido exitosamente'
      });

    } catch (error) {
      console.error('Error al obtener detalle del curso:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener actividades de un curso específico
  getActividadesPorCurso: async (req, res) => {
    try {
      const { cursoId } = req.params;

      const actividades = await Actividad.findAll({
        include: [
          {
            model: Unidad,
            as: 'unidad',
            where: { id_curso: cursoId },
            attributes: ['titulo_unidad', 'numero_unidad']
          }
        ],
        order: [
          [{ model: Unidad, as: 'unidad' }, 'numero_unidad', 'ASC'],
          ['created_at', 'ASC']
        ]
      });

      // Agrupar actividades por estado (pendientes, vencidas)
      const ahora = new Date();
      const actividadesConEstado = actividades.map(actividad => {
        const fechaLimite = new Date(actividad.fecha_limite);
        let estado = 'pendiente';
        
        if (actividad.fecha_limite && fechaLimite < ahora) {
          estado = 'vencida';
        }

        return {
          ...actividad.toJSON(),
          estado_para_estudiante: estado,
          dias_restantes: actividad.fecha_limite ? 
            Math.ceil((fechaLimite - ahora) / (1000 * 60 * 60 * 24)) : null
        };
      });

      const estadisticas = {
        total: actividades.length,
        pendientes: actividadesConEstado.filter(a => a.estado_para_estudiante === 'pendiente').length,
        vencidas: actividadesConEstado.filter(a => a.estado_para_estudiante === 'vencida').length,
        individuales: actividades.filter(a => a.tipo_actividad === 'individual').length,
        grupales: actividades.filter(a => a.tipo_actividad === 'grupal').length
      };

      res.status(200).json({
        success: true,
        data: {
          actividades: actividadesConEstado,
          estadisticas
        },
        message: 'Actividades del curso obtenidas exitosamente'
      });

    } catch (error) {
      console.error('Error al obtener actividades del curso:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener actividades pendientes de TODOS los cursos
  getActividadesPendientes: async (req, res) => {
    try {
      const actividades = await Actividad.findAll({
        include: [
          {
            model: Unidad,
            as: 'unidad',
            attributes: ['titulo_unidad'],
            include: [
              {
                model: Curso,
                as: 'curso',
                attributes: ['nombre_curso'],
                where: { estado: 'activo' }
              }
            ]
          }
        ],
        order: [['fecha_limite', 'ASC']]
      });

      // Filtrar solo actividades futuras o sin fecha límite
      const ahora = new Date();
      const actividadesPendientes = actividades.filter(actividad => {
        if (!actividad.fecha_limite) return true; // Sin fecha límite = siempre disponible
        return new Date(actividad.fecha_limite) >= ahora;
      });

      // Agregar información útil para el estudiante
      const actividadesConInfo = actividadesPendientes.map(actividad => {
        const diasRestantes = actividad.fecha_limite ? 
          Math.ceil((new Date(actividad.fecha_limite) - ahora) / (1000 * 60 * 60 * 24)) : null;
        
        let prioridad = 'normal';
        if (diasRestantes !== null) {
          if (diasRestantes <= 1) prioridad = 'urgente';
          else if (diasRestantes <= 3) prioridad = 'alta';
          else if (diasRestantes <= 7) prioridad = 'media';
        }

        return {
          ...actividad.toJSON(),
          dias_restantes: diasRestantes,
          prioridad
        };
      });

      res.status(200).json({
        success: true,
        data: actividadesConInfo,
        message: 'Actividades pendientes obtenidas exitosamente'
      });

    } catch (error) {
      console.error('Error al obtener actividades pendientes:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

};

module.exports = cursoEstudianteController;