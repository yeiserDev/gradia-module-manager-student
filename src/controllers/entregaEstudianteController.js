// src/controllers/entregaEstudianteController.js
const { Actividad, Entrega, ArchivoEntrega, Unidad, Curso } = require('../models/associations');
const sequelize = require('../config/database');
const { verificarInscripcionEnActividad } = require('../utils/inscripcionHelper');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

// Extensiones de video permitidas
const EXTENSIONES_VIDEO = ["mp4", "mov", "avi", "mkv", "webm", "m4v"];

// Cliente AWS
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const entregaEstudianteController = {

  // Obtener MIS entregas realizadas
  getMisEntregas: async (req, res) => {
    try {
      const usuarioId = req.user.id; // 🔧 Usuario autenticado desde JWT

      const entregas = await Entrega.findAll({
        where: { id_usuario: usuarioId },
        include: [
          {
            model: Actividad,
            as: 'actividad',
            attributes: ['id_actividad', 'nombre_actividad', 'fecha_limite', 'tipo_actividad'],
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
      const usuarioId = req.user.id; // 🔧 Usuario autenticado desde JWT

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

  // Obtener MI entrega para una actividad específica
  getEntregaPorActividad: async (req, res) => {
    try {
      const { actividadId } = req.params;
      const usuarioId = req.user.id;

      console.log(`🔍 Buscando entrega del usuario ${usuarioId} para actividad ${actividadId}`);

      const entrega = await Entrega.findOne({
        where: {
          id_actividad: actividadId,
          id_usuario: usuarioId
        },
        include: [
          {
            model: ArchivoEntrega,
            as: 'archivos',
            attributes: ['id_archivo_entrega', 'nombre_archivo', 'tipo_archivo', 'url_archivo', 'created_at']
          }
        ]
      });

      if (!entrega) {
        return res.status(404).json({
          success: false,
          message: 'No tienes una entrega para esta actividad',
          data: null
        });
      }

      console.log(`✅ Entrega encontrada:`, entrega.id_entrega, `con ${entrega.archivos.length} archivos`);
      console.log(`📊 [DEBUG] Datos de la entrega:`, JSON.stringify({
        id_entrega: entrega.id_entrega,
        calificacion: entrega.calificacion,
        retroalimentacion: entrega.retroalimentacion,
        fecha_entrega: entrega.fecha_entrega
      }));

      res.status(200).json({
        success: true,
        data: entrega,
        message: 'Entrega obtenida exitosamente'
      });

    } catch (error) {
      console.error('Error al obtener entrega por actividad:', error);
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
      const { id_actividad } = req.body;
      const usuarioId = req.user.id;

      if (!id_actividad) {
        return res.status(400).json({ success: false, message: "El campo id_actividad es obligatorio" });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: "Debes subir al menos un archivo" });
      }

      const entregaExistente = await Entrega.findOne({
        where: { id_actividad, id_usuario: usuarioId }
      });

      if (entregaExistente) {
        return res.status(400).json({
          success: false,
          message: "Ya tienes una entrega. Usa PUT para actualizar.",
          entrega_existente: entregaExistente.id_entrega
        });
      }

      // Crear entrega
      const nuevaEntrega = await Entrega.create({
        id_actividad,
        id_usuario: usuarioId,
        id_grupo: null,
        num_intento: 1,
        fecha_entrega: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      });

      // Procesar archivo subido
      const extension = req.file.originalname.split(".").pop().toLowerCase();
      const isVideo = EXTENSIONES_VIDEO.includes(extension);
      const carpeta = isVideo ? "videos" : "docs";

      const filename = `${usuarioId}-${id_actividad}-${nuevaEntrega.id_entrega}-${Date.now()}.${extension}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET,
          Key: `${carpeta}/${filename}`,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        })
      );

      const fileUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${carpeta}/${filename}`;

      await ArchivoEntrega.create({
        id_entrega: nuevaEntrega.id_entrega,
        nombre_archivo: filename,
        tipo_archivo: req.file.mimetype,
        url_archivo: fileUrl,
        version: 1,
        created_at: new Date()
      });

      const entregaCompleta = await Entrega.findByPk(nuevaEntrega.id_entrega, {
        include: [{ model: ArchivoEntrega, as: "archivos" }]
      });

      return res.status(201).json({
        success: true,
        data: entregaCompleta,
        message: "Entrega creada exitosamente"
      });

    } catch (error) {
      console.error("Error al crear entrega:", error);
      return res.status(500).json({ success: false, message: "Error interno", error: error.message });
    }
  },

  // Actualizar entrega existente (NUEVO INTENTO)
  updateEntrega: async (req, res) => {
    try {
      const { entregaId } = req.params;
      const usuarioId = req.user.id;

      // Buscar la entrega
      const entrega = await Entrega.findOne({
        where: {
          id_entrega: entregaId,
          id_usuario: usuarioId
        },
        include: [{ model: Actividad, as: "actividad" }]
      });

      if (!entrega) {
        return res.status(404).json({
          success: false,
          message: "Entrega no encontrada o no tienes permisos"
        });
      }

      // Validar fecha límite
      if (entrega.actividad?.fecha_limite) {
        const ahora = new Date();
        const fechaLimite = new Date(entrega.actividad.fecha_limite);

        if (ahora > fechaLimite) {
          return res.status(400).json({
            success: false,
            message: "No puedes actualizar después de la fecha límite"
          });
        }
      }

      // Obtener archivos actuales
      const archivosEntrega = await ArchivoEntrega.findAll({
        where: { id_entrega: entregaId }
      });

      // BLOQUEAR si existe VIDEO
      const tieneVideo = archivosEntrega.some((archivo) => {
        const ext = archivo.nombre_archivo.split(".").pop().toLowerCase();
        return EXTENSIONES_VIDEO.includes(ext);
      });

      if (tieneVideo) {
        return res.status(400).json({
          success: false,
          message: "No puedes editar una entrega que contiene un video."
        });
      }

      // Validar archivo recibido
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Debes subir un archivo para actualizar"
        });
      }

      const extension = req.file.originalname.split(".").pop().toLowerCase();

      if (EXTENSIONES_VIDEO.includes(extension)) {
        return res.status(400).json({
          success: false,
          message: "No puedes actualizar usando un archivo de video."
        });
      }

      // === ELIMINAR DOCUMENTOS ANTERIORES ===
      for (const archivo of archivosEntrega) {
        const key = archivo.url_archivo.split(".amazonaws.com/")[1];

        try {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET,
              Key: key
            })
          );
        } catch (err) {
          console.log("Error eliminando archivo previo:", err);
        }
      }

      await ArchivoEntrega.destroy({
        where: { id_entrega: entregaId }
      });

      // === SUBIR NUEVO DOCUMENTO ===
      const timestamp = Date.now();
      const filename = `${usuarioId}-${entrega.actividad.id_actividad}-${entregaId}-${timestamp}.${extension}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET,
          Key: `docs/${filename}`,
          Body: req.file.buffer,
          ContentType: req.file.mimetype
        })
      );

      const fileUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/docs/${filename}`;

      await ArchivoEntrega.create({
        id_entrega: entregaId,
        nombre_archivo: filename,
        tipo_archivo: req.file.mimetype,
        url_archivo: fileUrl,
        version: entrega.num_intento + 1,
        created_at: new Date()
      });

      // Actualizar entrega
      await entrega.update({
        fecha_entrega: new Date(),
        num_intento: entrega.num_intento + 1,
        updated_at: new Date()
      });

      return res.status(200).json({
        success: true,
        message: "Entrega actualizada correctamente",
        url_archivo: fileUrl
      });

    } catch (error) {
      console.error("Error actualizando entrega:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message
      });
    }
  },

  // Eliminar mi entrega (solo antes de fecha límite)
  deleteEntrega: async (req, res) => {
    try {
      const { entregaId } = req.params;
      const usuarioId = req.user.id; // 🔧 Usuario autenticado desde JWT

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

      // Eliminar registros asociados en orden (evitar FK constraint)

      // 1. Eliminar comentarios asociados (si existen)
      await sequelize.query(
        'DELETE FROM actividades.comentario WHERE id_entrega = :entregaId',
        {
          replacements: { entregaId },
          type: sequelize.QueryTypes.DELETE
        }
      );

      // 4. Eliminar archivos asociados
      // === ELIMINAR ARCHIVOS ASOCIADOS (solo documentos) === //

      const s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_KEY,
        },
      });

      // Obtener archivos asociados a la entrega
      const archivosEntrega = await ArchivoEntrega.findAll({
        where: { id_entrega: entregaId }
      });

      // --- BLOQUEAR BORRADO SI EXISTE VIDEO ---
      const extensionesVideo = ["mp4", "mov", "avi", "mkv", "webm", "m4v"];

      const tieneVideo = archivosEntrega.some(archivo => {
        const extension = archivo.nombre_archivo.split('.').pop().toLowerCase();
        return (
          extensionesVideo.includes(extension) ||
          (archivo.tipo_archivo && archivo.tipo_archivo.startsWith("video/")) ||
          archivo.url_archivo.includes("/videos/")
        );
      });

      if (tieneVideo) {
        return res.status(400).json({
          success: false,
          message: "No puedes eliminar una entrega que contiene un video."
        });
      }

      // --- SI NO HAY VIDEO, ELIMINAR DOCUMENTOS DE S3 ---
      for (const archivo of archivosEntrega) {
        const extension = archivo.nombre_archivo.split('.').pop().toLowerCase();

        const esVideo =
          extensionesVideo.includes(extension) ||
          (archivo.tipo_archivo && archivo.tipo_archivo.startsWith("video/")) ||
          archivo.url_archivo.includes("/videos/");

        if (!esVideo) {
          console.log("🗑 Eliminando DOCUMENTO de S3:", archivo.url_archivo);

          const key = archivo.url_archivo.split(".amazonaws.com/")[1];

          try {
            await s3.send(new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET,
              Key: key,
            }));
            console.log("✔ Documento eliminado:", key);
          } catch (err) {
            console.error("❌ Error eliminando documento:", err);
          }

        } else {
          console.log("🎥 Archivo es VIDEO, NO se elimina de S3:", archivo.nombre_archivo);
        }
      }



      await ArchivoEntrega.destroy({
        where: { id_entrega: entregaId }
      });

      // 5. Finalmente eliminar la entrega
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
      const usuarioId = req.user.id; // 🔧 Usuario autenticado desde JWT

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