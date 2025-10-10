// src/controllers/evaluacionEstudianteController.js
const {
  Evaluacion,
  DetalleEvaluacion,
  Rubrica,
  Criterio,
  NivelCriterio,
  Entrega,
  Actividad,
  Unidad,
  Curso
} = require('../models/associations');
const { Op } = require('sequelize');

const evaluacionEstudianteController = {

  // 1. Ver la evaluación de una entrega específica
  getEvaluacionByEntrega: async (req, res) => {
    try {
      const { entregaId } = req.params;
      const { usuarioId = 1 } = req.query;

      // Verificar que la entrega pertenece al estudiante
      const entrega = await Entrega.findOne({
        where: {
          id_entrega: entregaId,
          id_usuario: usuarioId
        }
      });

      if (!entrega) {
        return res.status(404).json({
          success: false,
          message: 'Entrega no encontrada o no tienes permisos para verla'
        });
      }

      // Obtener la evaluación con todos sus detalles
      const evaluacion = await Evaluacion.findOne({
        where: { id_entrega: entregaId },
        include: [
          {
            model: Entrega,
            as: 'entrega',
            attributes: ['id_entrega', 'fecha_entrega', 'num_intento'],
            include: [
              {
                model: Actividad,
                as: 'actividad',
                attributes: ['id_actividad', 'nombre_actividad', 'fecha_limite'],
                include: [
                  {
                    model: Unidad,
                    as: 'unidad',
                    attributes: ['titulo_unidad'],
                    include: [
                      {
                        model: Curso,
                        as: 'curso',
                        attributes: ['nombre_curso']
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            model: DetalleEvaluacion,
            as: 'detalles',
            include: [
              {
                model: Criterio,
                as: 'criterio',
                attributes: ['id_criterio', 'nombre_criterio', 'descripcion', 'peso']
              },
              {
                model: NivelCriterio,
                as: 'nivel',
                attributes: ['id_nivel_criterio', 'nombre_nivel', 'descripcion', 'puntuacion'],
                required: false
              }
            ]
          }
        ]
      });

      if (!evaluacion) {
        return res.status(404).json({
          success: false,
          message: 'Esta entrega aún no ha sido evaluada'
        });
      }

      // Calcular información adicional
      const puntuacionMaxima = evaluacion.detalles.reduce((sum, detalle) => {
        return sum + parseFloat(detalle.criterio.peso);
      }, 0);

      const porcentaje = (parseFloat(evaluacion.puntuacion_total) / puntuacionMaxima) * 100;

      res.status(200).json({
        success: true,
        data: {
          ...evaluacion.toJSON(),
          info_adicional: {
            puntuacion_maxima: puntuacionMaxima,
            porcentaje: Math.round(porcentaje * 100) / 100,
            total_criterios: evaluacion.detalles.length
          }
        },
        message: 'Evaluación obtenida exitosamente'
      });

    } catch (error) {
      console.error('Error al obtener evaluación:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // 2. Ver historial de todas mis calificaciones
  getMisCalificaciones: async (req, res) => {
    try {
      const { usuarioId = 1 } = req.query;

      const evaluaciones = await Evaluacion.findAll({
        include: [
          {
            model: Entrega,
            as: 'entrega',
            where: { id_usuario: usuarioId },
            attributes: ['id_entrega', 'fecha_entrega', 'num_intento'],
            include: [
              {
                model: Actividad,
                as: 'actividad',
                attributes: ['id_actividad', 'nombre_actividad', 'tipo_actividad', 'fecha_limite'],
                include: [
                  {
                    model: Unidad,
                    as: 'unidad',
                    attributes: ['titulo_unidad', 'numero_unidad'],
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
            ]
          }
        ],
        order: [['fecha_evaluacion', 'DESC']]
      });

      // Calcular estadísticas
      if (evaluaciones.length > 0) {
        const puntuaciones = evaluaciones.map(e => parseFloat(e.puntuacion_total));
        const promedio = puntuaciones.reduce((sum, p) => sum + p, 0) / puntuaciones.length;
        const mejor = Math.max(...puntuaciones);
        const peor = Math.min(...puntuaciones);

        // Agrupar por curso
        const porCurso = {};
        evaluaciones.forEach(eval => {
          const cursoId = eval.entrega.actividad.unidad.curso.id_curso;
          const cursoNombre = eval.entrega.actividad.unidad.curso.nombre_curso;

          if (!porCurso[cursoId]) {
            porCurso[cursoId] = {
              curso: cursoNombre,
              evaluaciones: 0,
              promedio: 0,
              suma: 0
            };
          }

          porCurso[cursoId].evaluaciones++;
          porCurso[cursoId].suma += parseFloat(eval.puntuacion_total);
        });

        // Calcular promedios por curso
        Object.keys(porCurso).forEach(cursoId => {
          porCurso[cursoId].promedio = Math.round(
            (porCurso[cursoId].suma / porCurso[cursoId].evaluaciones) * 100
          ) / 100;
          delete porCurso[cursoId].suma;
        });

        res.status(200).json({
          success: true,
          data: {
            evaluaciones: evaluaciones.map(e => e.toJSON()),
            estadisticas: {
              total_evaluaciones: evaluaciones.length,
              promedio_general: Math.round(promedio * 100) / 100,
              mejor_calificacion: mejor,
              peor_calificacion: peor,
              por_curso: Object.values(porCurso)
            }
          },
          message: 'Historial de calificaciones obtenido exitosamente'
        });
      } else {
        res.status(200).json({
          success: true,
          data: {
            evaluaciones: [],
            estadisticas: {
              total_evaluaciones: 0,
              promedio_general: 0,
              mensaje: 'Aún no tienes calificaciones'
            }
          },
          message: 'No tienes calificaciones registradas'
        });
      }

    } catch (error) {
      console.error('Error al obtener calificaciones:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // 3. Ver la rúbrica de una actividad (antes de entregar)
  getRubricaByActividad: async (req, res) => {
    try {
      const { actividadId } = req.params;

      // Obtener la actividad con su rúbrica
      const actividad = await Actividad.findByPk(actividadId, {
        attributes: ['id_actividad', 'nombre_actividad', 'descripcion', 'id_rubrica'],
        include: [
          {
            model: Unidad,
            as: 'unidad',
            attributes: ['titulo_unidad'],
            include: [
              {
                model: Curso,
                as: 'curso',
                attributes: ['nombre_curso']
              }
            ]
          }
        ]
      });

      if (!actividad) {
        return res.status(404).json({
          success: false,
          message: 'Actividad no encontrada'
        });
      }

      if (!actividad.id_rubrica) {
        return res.status(404).json({
          success: false,
          message: 'Esta actividad no tiene rúbrica asignada'
        });
      }

      // Obtener la rúbrica completa con criterios y niveles
      const rubrica = await Rubrica.findByPk(actividad.id_rubrica, {
        include: [
          {
            model: Criterio,
            as: 'criterios',
            through: { attributes: ['orden'] },
            include: [
              {
                model: NivelCriterio,
                as: 'niveles',
                attributes: ['id_nivel_criterio', 'nombre_nivel', 'descripcion', 'puntuacion']
              }
            ]
          }
        ]
      });

      if (!rubrica) {
        return res.status(404).json({
          success: false,
          message: 'Rúbrica no encontrada'
        });
      }

      // Calcular puntuación máxima
      const puntuacionMaxima = rubrica.criterios.reduce((sum, criterio) => {
        return sum + parseFloat(criterio.peso);
      }, 0);

      res.status(200).json({
        success: true,
        data: {
          actividad: {
            id_actividad: actividad.id_actividad,
            nombre_actividad: actividad.nombre_actividad,
            descripcion: actividad.descripcion,
            unidad: actividad.unidad,
            curso: actividad.unidad.curso
          },
          rubrica: {
            ...rubrica.toJSON(),
            puntuacion_maxima: puntuacionMaxima,
            total_criterios: rubrica.criterios.length
          }
        },
        message: 'Rúbrica obtenida exitosamente'
      });

    } catch (error) {
      console.error('Error al obtener rúbrica:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // 4. Estadísticas de evaluaciones
  getEstadisticasEvaluaciones: async (req, res) => {
    try {
      const { usuarioId = 1 } = req.query;

      // Obtener todas las evaluaciones del estudiante
      const evaluaciones = await Evaluacion.findAll({
        include: [
          {
            model: Entrega,
            as: 'entrega',
            where: { id_usuario: usuarioId },
            attributes: ['id_entrega', 'fecha_entrega'],
            include: [
              {
                model: Actividad,
                as: 'actividad',
                attributes: ['nombre_actividad', 'tipo_actividad'],
                include: [
                  {
                    model: Unidad,
                    as: 'unidad',
                    attributes: ['titulo_unidad'],
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
            ]
          }
        ],
        order: [['fecha_evaluacion', 'ASC']]
      });

      if (evaluaciones.length === 0) {
        return res.status(200).json({
          success: true,
          data: {
            total_evaluaciones: 0,
            mensaje: 'Aún no tienes evaluaciones registradas'
          },
          message: 'No hay estadísticas disponibles'
        });
      }

      // Calcular estadísticas generales
      const puntuaciones = evaluaciones.map(e => parseFloat(e.puntuacion_total));
      const promedio = puntuaciones.reduce((sum, p) => sum + p, 0) / puntuaciones.length;

      // Tendencia (últimas 5 vs primeras 5)
      const recientes = puntuaciones.slice(-5);
      const antiguas = puntuaciones.slice(0, 5);
      const promedioReciente = recientes.reduce((sum, p) => sum + p, 0) / recientes.length;
      const promedioAntiguo = antiguas.reduce((sum, p) => sum + p, 0) / antiguas.length;
      const tendencia = promedioReciente > promedioAntiguo ? 'mejorando' :
                        promedioReciente < promedioAntiguo ? 'decreciendo' : 'estable';

      // Por tipo de actividad
      const individuales = evaluaciones.filter(e => e.entrega.actividad.tipo_actividad === 'individual');
      const grupales = evaluaciones.filter(e => e.entrega.actividad.tipo_actividad === 'grupal');

      const promedioIndividual = individuales.length > 0 ?
        individuales.reduce((sum, e) => sum + parseFloat(e.puntuacion_total), 0) / individuales.length : 0;

      const promedioGrupal = grupales.length > 0 ?
        grupales.reduce((sum, e) => sum + parseFloat(e.puntuacion_total), 0) / grupales.length : 0;

      // Por curso
      const porCurso = {};
      evaluaciones.forEach(eval => {
        const cursoId = eval.entrega.actividad.unidad.curso.id_curso;
        const cursoNombre = eval.entrega.actividad.unidad.curso.nombre_curso;

        if (!porCurso[cursoId]) {
          porCurso[cursoId] = {
            id_curso: cursoId,
            nombre_curso: cursoNombre,
            evaluaciones: 0,
            suma: 0,
            mejor: 0,
            peor: 100
          };
        }

        const puntuacion = parseFloat(eval.puntuacion_total);
        porCurso[cursoId].evaluaciones++;
        porCurso[cursoId].suma += puntuacion;
        porCurso[cursoId].mejor = Math.max(porCurso[cursoId].mejor, puntuacion);
        porCurso[cursoId].peor = Math.min(porCurso[cursoId].peor, puntuacion);
      });

      // Calcular promedios y formatear
      Object.keys(porCurso).forEach(cursoId => {
        porCurso[cursoId].promedio = Math.round(
          (porCurso[cursoId].suma / porCurso[cursoId].evaluaciones) * 100
        ) / 100;
        delete porCurso[cursoId].suma;
      });

      res.status(200).json({
        success: true,
        data: {
          resumen: {
            total_evaluaciones: evaluaciones.length,
            promedio_general: Math.round(promedio * 100) / 100,
            mejor_calificacion: Math.max(...puntuaciones),
            peor_calificacion: Math.min(...puntuaciones),
            tendencia: tendencia
          },
          por_tipo: {
            individuales: {
              total: individuales.length,
              promedio: Math.round(promedioIndividual * 100) / 100
            },
            grupales: {
              total: grupales.length,
              promedio: Math.round(promedioGrupal * 100) / 100
            }
          },
          por_curso: Object.values(porCurso),
          ultimas_5: evaluaciones.slice(-5).map(e => ({
            id_evaluacion: e.id_evaluacion,
            actividad: e.entrega.actividad.nombre_actividad,
            puntuacion: parseFloat(e.puntuacion_total),
            fecha: e.fecha_evaluacion
          }))
        },
        message: 'Estadísticas de evaluaciones obtenidas exitosamente'
      });

    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

};

module.exports = evaluacionEstudianteController;
