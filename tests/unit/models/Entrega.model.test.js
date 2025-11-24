// tests/unit/models/Entrega.model.test.js
// Pruebas unitarias para el modelo Entrega - Backend Student

describe('Modelo Entrega', () => {
  describe('Definición del modelo', () => {
    test('Debería definir todos los campos requeridos', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.rawAttributes.id_entrega).toBeDefined();
      expect(Entrega.rawAttributes.fecha_entrega).toBeDefined();
      expect(Entrega.rawAttributes.id_actividad).toBeDefined();
      expect(Entrega.rawAttributes.id_usuario).toBeDefined();
      expect(Entrega.rawAttributes.num_intento).toBeDefined();
      expect(Entrega.rawAttributes.calificacion).toBeDefined();
      expect(Entrega.rawAttributes.retroalimentacion).toBeDefined();
    });

    test('id_entrega debería ser primaryKey y autoIncrement', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.rawAttributes.id_entrega.primaryKey).toBe(true);
      expect(Entrega.rawAttributes.id_entrega.autoIncrement).toBe(true);
    });

    test('fecha_entrega no debería permitir valores NULL', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.rawAttributes.fecha_entrega.allowNull).toBe(false);
    });

    test('num_intento debería tener valor por defecto 1', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.rawAttributes.num_intento.defaultValue).toBe(1);
    });
  });

  describe('Campos opcionales', () => {
    test('id_usuario debería permitir NULL para entregas grupales', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.rawAttributes.id_usuario.allowNull).toBe(true);
    });

    test('calificacion debería permitir NULL', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.rawAttributes.calificacion.allowNull).toBe(true);
    });

    test('retroalimentacion debería permitir NULL', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.rawAttributes.retroalimentacion.allowNull).toBe(true);
    });
  });

  describe('Configuración de la tabla', () => {
    test('Debería usar el nombre de tabla correcto', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.tableName).toBe('entrega');
    });

    test('Debería usar el schema correcto', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.options.schema).toBe('actividades');
    });

    test('Debería tener timestamps deshabilitado', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.options.timestamps).toBe(false);
    });
  });

  describe('Relaciones', () => {
    test('Debería tener foreign key id_actividad obligatorio', () => {
      const Entrega = require('../../../src/models/Entrega');

      expect(Entrega.rawAttributes.id_actividad).toBeDefined();
      expect(Entrega.rawAttributes.id_actividad.allowNull).toBe(false);
    });
  });
});
