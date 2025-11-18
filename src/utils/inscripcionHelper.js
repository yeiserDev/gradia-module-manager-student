// utils/inscripcionHelper.js
// Helper functions para verificar inscripción de estudiantes en cursos

const sequelize = require('../config/database');

/**
 * Verifica si un usuario (estudiante) está inscrito en un curso
 * @param {number} usuarioId - ID del usuario
 * @param {number} cursoId - ID del curso
 * @returns {Promise<boolean>} - true si está inscrito, false si no
 */
const verificarInscripcionEnCurso = async (usuarioId, cursoId) => {
  try {
    const query = `
      SELECT COUNT(*) as count
      FROM cursos.inscripcion
      WHERE id_usuario = :usuarioId
        AND id_curso = :cursoId
        AND deleted_at IS NULL
    `;

    const [result] = await sequelize.query(query, {
      replacements: { usuarioId, cursoId },
      type: sequelize.QueryTypes.SELECT
    });

    return parseInt(result.count) > 0;
  } catch (error) {
    console.error('Error al verificar inscripción:', error);
    throw error;
  }
};

/**
 * Obtiene el ID del curso al que pertenece una actividad
 * @param {number} actividadId - ID de la actividad
 * @returns {Promise<number|null>} - ID del curso o null si no se encuentra
 */
const obtenerCursoDeActividad = async (actividadId) => {
  try {
    const query = `
      SELECT u.id_curso
      FROM cursos.actividad a
      INNER JOIN cursos.unidad u ON a.id_unidad = u.id_unidad
      WHERE a.id_actividad = :actividadId
        AND a.deleted_at IS NULL
        AND u.deleted_at IS NULL
    `;

    const [result] = await sequelize.query(query, {
      replacements: { actividadId },
      type: sequelize.QueryTypes.SELECT
    });

    return result ? result.id_curso : null;
  } catch (error) {
    console.error('Error al obtener curso de actividad:', error);
    throw error;
  }
};

/**
 * Verifica si un usuario está inscrito en el curso de una actividad
 * @param {number} usuarioId - ID del usuario
 * @param {number} actividadId - ID de la actividad
 * @returns {Promise<boolean>} - true si está inscrito, false si no
 */
const verificarInscripcionEnActividad = async (usuarioId, actividadId) => {
  const cursoId = await obtenerCursoDeActividad(actividadId);
  if (!cursoId) return false;
  return await verificarInscripcionEnCurso(usuarioId, cursoId);
};

module.exports = {
  verificarInscripcionEnCurso,
  verificarInscripcionEnActividad,
  obtenerCursoDeActividad
};
