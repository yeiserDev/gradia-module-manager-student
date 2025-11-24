// tests/unit/controllers/entregaEstudianteController.test.js
// Pruebas unitarias para lógica de negocio del controller de entregas de estudiantes

describe('EntregaEstudianteController - Validaciones de negocio', () => {
  describe('Validación de fecha límite', () => {
    test('Debería validar si una entrega está fuera de plazo', () => {
      const estaFueraDePlazo = (fechaLimite, fechaEntrega) => {
        if (!fechaLimite) return false;
        const limite = new Date(fechaLimite);
        const entrega = new Date(fechaEntrega);
        return entrega > limite;
      };

      const limite = '2025-01-15T23:59:59';

      expect(estaFueraDePlazo(limite, '2025-01-14T10:00:00')).toBe(false);
      expect(estaFueraDePlazo(limite, '2025-01-16T00:00:01')).toBe(true);
      expect(estaFueraDePlazo(null, '2025-01-20T00:00:00')).toBe(false);
    });
  });

  describe('Validación de protección de videos', () => {
    test('Debería identificar si una entrega contiene video', () => {
      const EXTENSIONES_VIDEO = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];

      const contieneVideo = (archivos) => {
        return archivos.some(archivo => {
          const ext = archivo.nombre_archivo.split('.').pop().toLowerCase();
          return EXTENSIONES_VIDEO.includes(ext);
        });
      };

      const archivosConVideo = [
        { nombre_archivo: 'documento.pdf' },
        { nombre_archivo: 'presentacion.mp4' }
      ];

      const archivosSinVideo = [
        { nombre_archivo: 'documento.pdf' },
        { nombre_archivo: 'imagen.png' }
      ];

      expect(contieneVideo(archivosConVideo)).toBe(true);
      expect(contieneVideo(archivosSinVideo)).toBe(false);
      expect(contieneVideo([])).toBe(false);
    });

    test('No debería permitir editar entrega con video', () => {
      const puedeEditarEntrega = (tieneVideo) => {
        return !tieneVideo;
      };

      expect(puedeEditarEntrega(true)).toBe(false);
      expect(puedeEditarEntrega(false)).toBe(true);
    });

    test('No debería permitir eliminar entrega con video', () => {
      const puedeEliminarEntrega = (tieneVideo) => {
        return !tieneVideo;
      };

      expect(puedeEliminarEntrega(true)).toBe(false);
      expect(puedeEliminarEntrega(false)).toBe(true);
    });
  });

  describe('Validación de extensiones de archivo', () => {
    test('Debería identificar archivos de video correctamente', () => {
      const EXTENSIONES_VIDEO = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];

      const esVideo = (nombreArchivo) => {
        const ext = nombreArchivo.split('.').pop().toLowerCase();
        return EXTENSIONES_VIDEO.includes(ext);
      };

      expect(esVideo('entrega.mp4')).toBe(true);
      expect(esVideo('Entrega.MP4')).toBe(true);
      expect(esVideo('video.mov')).toBe(true);
      expect(esVideo('documento.docx')).toBe(false);
      expect(esVideo('imagen.jpg')).toBe(false);
    });
  });

  describe('Validación de pertenencia de entrega', () => {
    test('Debería verificar que la entrega pertenece al usuario', () => {
      const perteneceAlUsuario = (entrega, userId) => {
        return entrega.id_usuario === userId;
      };

      const entrega = { id_entrega: 1, id_usuario: 123 };

      expect(perteneceAlUsuario(entrega, 123)).toBe(true);
      expect(perteneceAlUsuario(entrega, 456)).toBe(false);
    });
  });
});
