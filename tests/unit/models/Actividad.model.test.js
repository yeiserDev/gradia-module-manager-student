// tests/unit/models/Actividad.model.test.js
// Pruebas unitarias para el modelo Actividad - Backend Student

describe('Modelo Actividad', () => {
  describe('Definición del modelo', () => {
    test('Debería definir todos los campos requeridos', () => {
      const Actividad = require('../../../src/models/Actividad');

      expect(Actividad.rawAttributes.id_actividad).toBeDefined();
      expect(Actividad.rawAttributes.nombre_actividad).toBeDefined();
      expect(Actividad.rawAttributes.descripcion).toBeDefined();
      expect(Actividad.rawAttributes.fecha_limite).toBeDefined();
      expect(Actividad.rawAttributes.tipo_actividad).toBeDefined();
      expect(Actividad.rawAttributes.id_unidad).toBeDefined();
    });

    test('id_actividad debería ser primaryKey y autoIncrement', () => {
      const Actividad = require('../../../src/models/Actividad');

      expect(Actividad.rawAttributes.id_actividad.primaryKey).toBe(true);
      expect(Actividad.rawAttributes.id_actividad.autoIncrement).toBe(true);
    });

    test('nombre_actividad no debería permitir valores NULL', () => {
      const Actividad = require('../../../src/models/Actividad');

      expect(Actividad.rawAttributes.nombre_actividad.allowNull).toBe(false);
    });

    test('tipo_actividad debería ser ENUM con valores individual y grupal', () => {
      const Actividad = require('../../../src/models/Actividad');

      expect(Actividad.rawAttributes.tipo_actividad.type.constructor.name).toBe('ENUM');
      expect(Actividad.rawAttributes.tipo_actividad.type.values).toEqual(['individual', 'grupal']);
    });

    test('fecha_limite debería permitir valores NULL', () => {
      const Actividad = require('../../../src/models/Actividad');

      expect(Actividad.rawAttributes.fecha_limite.allowNull).toBe(true);
    });
  });

  describe('Configuración de la tabla', () => {
    test('Debería usar el nombre de tabla correcto', () => {
      const Actividad = require('../../../src/models/Actividad');

      expect(Actividad.tableName).toBe('actividad');
    });

    test('Debería usar el schema correcto', () => {
      const Actividad = require('../../../src/models/Actividad');

      expect(Actividad.options.schema).toBe('actividades');
    });

    test('Debería tener timestamps deshabilitado', () => {
      const Actividad = require('../../../src/models/Actividad');

      expect(Actividad.options.timestamps).toBe(false);
    });
  });

  describe('Relaciones', () => {
    test('Debería tener foreign key id_unidad', () => {
      const Actividad = require('../../../src/models/Actividad');

      expect(Actividad.rawAttributes.id_unidad).toBeDefined();
      expect(Actividad.rawAttributes.id_unidad.allowNull).toBe(false);
    });
  });
});
