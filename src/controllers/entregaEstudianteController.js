// src/controllers/entregaEstudianteController.js
const { Actividad, Entrega, ArchivoEntrega, Sesion, Unidad, Curso } = require('../models/associations');

const entregaEstudianteController = {

  // Obtener MIS entregas realizadas
  getMisEntregas: async (req, res) => {
    try {
      const { usuarioId = 1 } = req.query; // Temporal: simular usuario logueado

      const entregas = await Entrega.findAll({
        where: { id_usuario: usuarioId },
        include: [
          {
            model: Actividad,
            as: 'actividad',
            attributes: ['id_actividad', 'nombre_actividad', 'fecha_limite', 'tipo_actividad'],
            include: [
              {
                model: Sesion,
                as: 'sesion',
                attributes: ['titulo_sesion'],
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
            model: ArchivoEntrega,
            as: 'archivos',
            attributes: ['id_archivo_entrega', 'nombre_archivo', 'tipo_archivo', 'url_archivo', 'created_at']
          }
        ],
        order: [['fecha_entrega', 'DESC']]
      });

      // Agregar información útil para el estudiante
      const entregasConEstado = entregas.map(entrega => {
        const fechaLimite = new Date(entrega.actividad.fecha_limite);
        const fechaEntrega = new Date(entrega.fecha_entrega);
        
        let estado = 'entregado';
        let puntualidad = 'a_tiempo';
        
        if (entrega.actividad.fecha_limite && fechaEntrega > fechaLimite) {
          puntualidad = 'tardio';
        }

        return {
          ...entrega.toJSON(),
          estado_entrega: estado,
          puntualidad,
          total_archivos: entrega.archivos.length
        };
      });

      const estadisticas = {
        total_entregas: entregas.length,
        entregas_a_tiempo: entregasConEstado.filter(e => e.puntualidad === 'a_tiempo').length,
        entregas_tardias: entregasConEstado.filter(e => e.puntualidad === 'tardio').length,
        entregas_individuales: entregas.filter(e => e.actividad.tipo_actividad === 'individual').length,
        entregas_grupales: entregas.filter(e => e.actividad.tipo_actividad === 'grupal').length
      };

      res.status(200).json({
        success: true,
        data: {
          entregas: entregasConEstado,
          estadisticas
        },
        message: 'Mis entregas obtenidas exitosamente'
      });

    } catch (error) {
      console.error('Error al obtener mis entregas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener detalle de UNA entrega específica
  getDetalleEntrega: async (req, res) => {
    try {
      const { entregaId } = req.params;
      const { usuarioId = 1 } = req.query; // Temporal: simular usuario logueado

      const entrega = await Entrega.findOne({
        where: { 
          id_entrega: entregaId,
          id_usuario: usuarioId // Solo puede ver SUS entregas
        },
        include: [
          {
            model: Actividad,
            as: 'actividad',
            include: [
              {
                model: Sesion,
                as: 'sesion',
                attributes: ['titulo_sesion'],
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
            model: ArchivoEntrega,
            as: 'archivos'
          }
        ]
      });

      if (!entrega) {
        return res.status(404).json({
          success: false,
          message: 'Entrega no encontrada o no tienes permisos para verla'
        });
      }

      // Calcular información adicional
      const fechaLimite = new Date(entrega.actividad.fecha_limite);
      const fechaEntrega = new Date(entrega.fecha_entrega);
      
      const infoAdicional = {
        puntualidad: entrega.actividad.fecha_limite && fechaEntrega > fechaLimite ? 'tardio' : 'a_tiempo',
        dias_diferencia: entrega.actividad.fecha_limite ? 
          Math.ceil((fechaEntrega - fechaLimite) / (1000 * 60 * 60 * 24)) : null,
        puede_reenviar: true, // Lógica para determinar si puede hacer otro intento
        total_archivos: entrega.archivos.length,
        total_mb: entrega.archivos.reduce((total, archivo) => total + (archivo.tamaño || 0), 0)
      };

      res.status(200).json({
        success: true,
        data: {
          ...entrega.toJSON(),
          info_adicional: infoAdicional
        },
        message: 'Detalle de entrega obtenido exitosamente'
      });

    } catch (error) {
      console.error('Error al obtener detalle de entrega:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // CREAR nueva entrega (ENVIAR TAREA)
  createEntrega: async (req, res) => {
    try {
      const { 
        id_actividad, 
        id_usuario = 1, // Temporal: simular usuario logueado
        archivos = [] // Array de archivos subidos
      } = req.body;

      // Validar campos obligatorios
      if (!id_actividad) {
        return res.status(400).json({
          success: false,
          message: 'El campo id_actividad es obligatorio'
        });
      }

      // Verificar que la actividad existe y está disponible
      const actividad = await Actividad.findByPk(id_actividad);
      if (!actividad) {
        return res.status(404).json({
          success: false,
          message: 'La actividad especificada no existe'
        });
      }

      // Verificar fecha límite
      if (actividad.fecha_limite) {
        const ahora = new Date();
        const fechaLimite = new Date(actividad.fecha_limite);
        
        if (ahora > fechaLimite) {
          return res.status(400).json({
            success: false,
            message: 'La fecha límite para esta actividad ya ha pasado',
            fecha_limite: actividad.fecha_limite
          });
        }
      }

      // Verificar si ya existe una entrega para esta actividad (actividades individuales)
      if (actividad.tipo_actividad === 'individual') {
        const entregaExistente = await Entrega.findOne({
          where: {
            id_actividad,
            id_usuario
          }
        });

        if (entregaExistente) {
          return res.status(400).json({
            success: false,
            message: 'Ya tienes una entrega para esta actividad. Usa PUT para actualizar.',
            entrega_existente: entregaExistente.id_entrega
          });
        }
      }

      // Crear la entrega
      const nuevaEntrega = await Entrega.create({
        id_actividad,
        id_usuario: actividad.tipo_actividad === 'individual' ? id_usuario : null,
        id_grupo: actividad.tipo_actividad === 'grupal' ? null : null, // TODO: implementar grupos
        num_intento: 1,
        fecha_entrega: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      });

      // Procesar archivos si los hay (simulado por ahora)
      const archivosCreados = [];
      for (const archivo of archivos) {
        const nuevoArchivo = await ArchivoEntrega.create({
          id_entrega: nuevaEntrega.id_entrega,
          nombre_archivo: archivo.nombre,
          tipo_archivo: archivo.tipo,
          url_archivo: archivo.url || '/uploads/temp_file.pdf', // Temporal
          version: 1,
          created_at: new Date()
        });
        archivosCreados.push(nuevoArchivo);
      }

      // Obtener la entrega completa
      const entregaCompleta = await Entrega.findByPk(nuevaEntrega.id_entrega, {
        include: [
          {
            model: Actividad,
            as: 'actividad',
            attributes: ['nombre_actividad', 'tipo_actividad', 'fecha_limite']
          },
          {
            model: ArchivoEntrega,
            as: 'archivos'
          }
        ]
      });

      res.status(201).json({
        success: true,
        data: entregaCompleta,
        message: 'Entrega creada exitosamente'
      });

    } catch (error) {
      console.error('Error al crear entrega:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Actualizar entrega existente (NUEVO INTENTO)
  updateEntrega: async (req, res) => {
    try {
      const { entregaId } = req.params;
      const { 
        id_usuario = 1, // Temporal: simular usuario logueado
        archivos = []
      } = req.body;

      // Buscar la entrega existente
      const entrega = await Entrega.findOne({
        where: {
          id_entrega: entregaId,
          id_usuario
        },
        include: [
          {
            model: Actividad,
            as: 'actividad'
          }
        ]
      });

      if (!entrega) {
        return res.status(404).json({
          success: false,
          message: 'Entrega no encontrada o no tienes permisos para actualizarla'
        });
      }

      // Verificar fecha límite
      if (entrega.actividad.fecha_limite) {
        const ahora = new Date();
        const fechaLimite = new Date(entrega.actividad.fecha_limite);
        
        if (ahora > fechaLimite) {
          return res.status(400).json({
            success: false,
            message: 'No puedes actualizar la entrega después de la fecha límite'
          });
        }
      }

      // Actualizar la entrega
      await entrega.update({
        fecha_entrega: new Date(),
        num_intento: entrega.num_intento + 1,
        updated_at: new Date()
      });

      // Agregar nuevos archivos (sin eliminar los anteriores por ahora)
      const archivosCreados = [];
      for (const archivo of archivos) {
        const nuevoArchivo = await ArchivoEntrega.create({
          id_entrega: entrega.id_entrega,
          nombre_archivo: archivo.nombre,
          tipo_archivo: archivo.tipo,
          url_archivo: archivo.url || '/uploads/temp_file.pdf',
          version: entrega.num_intento + 1,
          created_at: new Date()
        });
        archivosCreados.push(nuevoArchivo);
      }

      // Obtener la entrega actualizada completa
      const entregaActualizada = await Entrega.findByPk(entrega.id_entrega, {
        include: [
          {
            model: Actividad,
            as: 'actividad',
            attributes: ['nombre_actividad', 'tipo_actividad', 'fecha_limite']
          },
          {
            model: ArchivoEntrega,
            as: 'archivos'
          }
        ]
      });

      res.status(200).json({
        success: true,
        data: entregaActualizada,
        message: `Entrega actualizada exitosamente (Intento #${entrega.num_intento + 1})`
      });

    } catch (error) {
      console.error('Error al actualizar entrega:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Eliminar mi entrega (solo antes de fecha límite)
  deleteEntrega: async (req, res) => {
    try {
      const { entregaId } = req.params;
      const { usuarioId = 1 } = req.query; // Temporal: simular usuario logueado

      const entrega = await Entrega.findOne({
        where: {
          id_entrega: entregaId,
          id_usuario: usuarioId
        },
        include: [
          {
            model: Actividad,
            as: 'actividad'
          }
        ]
      });

      if (!entrega) {
        return res.status(404).json({
          success: false,
          message: 'Entrega no encontrada o no tienes permisos para eliminarla'
        });
      }

      // Verificar si puede eliminar (antes de fecha límite)
      if (entrega.actividad.fecha_limite) {
        const ahora = new Date();
        const fechaLimite = new Date(entrega.actividad.fecha_limite);
        
        if (ahora > fechaLimite) {
          return res.status(400).json({
            success: false,
            message: 'No puedes eliminar la entrega después de la fecha límite'
          });
        }
      }

      // Eliminar archivos asociados primero
      await ArchivoEntrega.destroy({
        where: { id_entrega: entregaId }
      });

      // Eliminar la entrega
      await entrega.destroy();

      res.status(200).json({
        success: true,
        message: 'Entrega eliminada exitosamente'
      });

    } catch (error) {
      console.error('Error al eliminar entrega:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Dashboard con estadísticas personales
  getDashboardEstudiante: async (req, res) => {
    try {
      const { usuarioId = 1 } = req.query; // Temporal: simular usuario logueado

      // Obtener mis entregas
      const misEntregas = await Entrega.count({
        where: { id_usuario: usuarioId }
      });

      // Obtener actividades pendientes para mí
      const actividadesDisponibles = await Actividad.count();

      // Entregas de esta semana
      const inicioSemana = new Date();
      inicioSemana.setDate(inicioSemana.getDate() - 7);
      
      const entregasEstaSemana = await Entrega.count({
        where: {
          id_usuario: usuarioId,
          fecha_entrega: {
            [require('sequelize').Op.gte]: inicioSemana
          }
        }
      });

      const estadisticas = {
        total_entregas_realizadas: misEntregas,
        entregas_esta_semana: entregasEstaSemana,
        actividades_disponibles: actividadesDisponibles,
        progreso_general: actividadesDisponibles > 0 ? 
          Math.round((misEntregas / actividadesDisponibles) * 100) : 0
      };

      res.status(200).json({
        success: true,
        data: estadisticas,
        message: 'Dashboard del estudiante obtenido exitosamente'
      });

    } catch (error) {
      console.error('Error al obtener dashboard:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

};

module.exports = entregaEstudianteController;