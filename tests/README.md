# Testing - Backend Student

## Estructura de Carpetas

```
tests/
├── unit/              # Pruebas unitarias (funciones aisladas)
│   └── authenticate.test.js
└── integration/       # Pruebas de integración (endpoints completos)
    └── entregas.test.js
```

## Comandos Disponibles

```bash
# Ejecutar TODAS las pruebas (unit + integration)
npm test

# Ejecutar SOLO pruebas unitarias
npm run test:unit

# Ejecutar SOLO pruebas de integración
npm run test:integration

# Ejecutar pruebas en modo watch (se re-ejecutan al guardar cambios)
npm run test:watch

# Ejecutar con reporte de cobertura de código
npm run test:coverage
```

## Tipos de Pruebas

### Pruebas Unitarias (unit/)
- Prueban funciones o módulos de forma aislada
- No requieren base de datos ni servidor corriendo
- Son rápidas y específicas
- Ejemplo: `authenticate.test.js` prueba el middleware de autenticación JWT

### Pruebas de Integración (integration/)
- Prueban endpoints completos de la API
- Requieren conexión a base de datos de test
- Simulan requests HTTP reales con supertest
- Ejemplo: `entregas.test.js` prueba CRUD de entregas de estudiantes

## Casos de Prueba Cubiertos

### Pruebas Unitarias
- ✓ Autenticación JWT: token válido/inválido/expirado
- ✓ Extracción de userId del token
- ✓ Manejo de requests sin token

### Pruebas de Integración (Placeholders)
- ✓ POST /entregas: crear entrega con archivo
- ✓ Validación de tamaño de archivo (200MB)
- ✓ PUT /entregas: protección contra edición con video
- ✓ DELETE /entregas: protección contra eliminación con video
- ✓ Validación de fecha límite
- ✓ GET /entregas: filtro por usuario autenticado

## Cómo Ejecutar las Pruebas Unitarias

```bash
# Ejecutar solo pruebas unitarias (funcionales ahora)
npm run test:unit
```

Las pruebas unitarias están **completamente funcionales** y no requieren configuración adicional.

## Configuración para Pruebas de Integración

Las pruebas de integración actualmente son **placeholders** (no ejecutan pruebas reales).

Para activarlas completamente:

1. **Modificar app.js** para exportar la app sin iniciar el servidor:
```javascript
// Al final de app.js, ANTES de app.listen()
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Backend Student en puerto ${PORT}`);
  });
}

module.exports = app;
```

2. **Configurar base de datos de test**:
```bash
# Crear .env.test
DATABASE_URL=postgresql://user:pass@localhost:5432/gradia_test
JWT_SECRET=test-secret-key
AWS_ACCESS_KEY_ID=test-key
AWS_SECRET_ACCESS_KEY=test-secret
AWS_BUCKET_NAME=test-bucket
```

3. **Mockear AWS S3** (para no subir archivos reales):
```javascript
// En tests/setup.js
jest.mock('@aws-sdk/client-s3');
```

4. **Descomentar los tests** en `integration/entregas.test.js`

## Ejemplo: Agregar Nueva Prueba Unitaria

```javascript
// tests/unit/validaciones.test.js
const { validarCalificacion } = require('../../src/utils/validaciones');

describe('Validación de Calificación', () => {
  test('Debería aceptar calificación entre 0 y 20', () => {
    expect(validarCalificacion(15)).toBe(true);
  });

  test('Debería rechazar calificación negativa', () => {
    expect(validarCalificacion(-5)).toBe(false);
  });

  test('Debería rechazar calificación mayor a 20', () => {
    expect(validarCalificacion(25)).toBe(false);
  });
});
```

## Ejemplo: Agregar Nueva Prueba de Integración

```javascript
// tests/integration/cursos.test.js
const request = require('supertest');
const app = require('../../app');

describe('GET /cursos', () => {
  test('Debería retornar solo cursos donde estoy inscrito', async () => {
    const response = await request(app)
      .get('/cursos')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

## Cobertura de Código

```bash
npm run test:coverage
```

Genera reporte HTML en `coverage/lcov-report/index.html` mostrando:
- % de líneas cubiertas
- % de funciones probadas
- % de ramas (if/else) ejecutadas

## Buenas Prácticas

[✓] **Tests descriptivos**: "Debería rechazar entrega después de fecha límite"
[✓] **AAA pattern**: Arrange (setup), Act (execute), Assert (verify)
[✓] **Tests independientes**: No depender del orden de ejecución
[✓] **Mock de servicios externos**: No llamar AWS S3 real, usar mocks
[✓] **Limpiar después**: Usar afterEach() para restaurar estado

## Matchers de Jest Más Usados

```javascript
// Igualdad
expect(a).toBe(b);                    // Igualdad estricta (===)
expect(obj).toEqual(expected);         // Igualdad profunda de objetos

// Booleanos
expect(value).toBeTruthy();           // Verdadero
expect(value).toBeFalsy();            // Falso
expect(value).toBeNull();             // null
expect(value).toBeDefined();          // No undefined

// Números
expect(num).toBeGreaterThan(5);       // > 5
expect(num).toBeLessThanOrEqual(10);  // <= 10

// Arrays y strings
expect(arr).toContain('item');        // Array contiene
expect(str).toMatch(/regex/);         // String coincide con regex

// Funciones (mocks)
expect(mockFn).toHaveBeenCalled();    // Función fue llamada
expect(mockFn).toHaveBeenCalledWith(arg); // Con argumentos
```

## Troubleshooting

**Error: "Cannot find module '../../app'"**
→ Asegurar que app.js exporte la aplicación: `module.exports = app;`

**Error: "ECONNREFUSED"**
→ Las pruebas de integración necesitan BD de test configurada

**Tests unitarios pasan, integración falla**
→ Es normal, los tests de integración son placeholders

**Error: "AWS credentials not found"**
→ Mockear AWS S3 o configurar credenciales de test en .env.test

**Tests lentos**
→ Ejecutar solo unit tests: `npm run test:unit`

## Próximos Pasos

1. Ejecutar pruebas unitarias existentes: `npm run test:unit`
2. Verificar que pasen todas las pruebas
3. Configurar base de datos de test para pruebas de integración
4. Descomentar y adaptar pruebas de integración
5. Agregar más casos de prueba según necesidad
