# 📮 ESTRUCTURA POSTMAN COLLECTION - BACKEND ESTUDIANTE

## 🎯 Información de la Colección

**Nombre:** `GradIA - Module Manager Student`
**Base URL:** `{{base_url}}` = `http://localhost:3001`
**Versión:** 1.0.0
**Descripción:** API Backend para vista de estudiante del sistema GradIA

---

## 📁 ESTRUCTURA DE CARPETAS

```
📦 Gradia-Module-Manager-Student
│
├── 📁 MÓDULO: CURSOS (4 requests)
│   ├── GET Obtener todos mis cursos
│   ├── GET Obtener detalle de un curso
│   ├── GET Obtener actividades de un curso
│   └── GET Obtener actividades pendientes (globales)
│
├── 📁 MÓDULO: ENTREGAS (6 requests)
│   ├── GET Dashboard del estudiante
│   ├── GET Obtener mis entregas
│   ├── GET Obtener detalle de una entrega
│   ├── POST Crear nueva entrega
│   ├── PUT Actualizar entrega (nuevo intento)
│   └── DELETE Eliminar entrega
│
└── 📁 UTILIDADES (2 requests)
    ├── GET Verificar estado del servidor
    └── GET Verificar salud y conexión a BD
```

**Total:** 12 requests (10 endpoints + 2 utilidades)

---

## 🔧 VARIABLES DE ENTORNO

### Environment: `Gradia Student - Local`

```json
{
  "base_url": "http://localhost:3001",
  "usuario_id": "1"
}
```

### Environment: `Gradia Student - Production`

```json
{
  "base_url": "https://tu-backend-estudiante.render.com",
  "usuario_id": "1"
}
```

---

## 📝 DETALLE DE CADA REQUEST

### 📁 MÓDULO: CURSOS

#### 1. GET Obtener todos mis cursos
- **Método:** GET
- **URL:** `{{base_url}}/api/student/cursos`
- **Headers:** `Content-Type: application/json`
- **Descripción:** Obtiene todos los cursos activos con unidades, actividades y estadísticas
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success true", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
});

pm.test("Response has data array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.be.an('array');
});
```

---

#### 2. GET Obtener detalle de un curso
- **Método:** GET
- **URL:** `{{base_url}}/api/student/cursos/:cursoId`
- **Path Variables:**
  - `cursoId`: 1
- **Headers:** `Content-Type: application/json`
- **Descripción:** Obtiene el detalle completo de un curso con toda su jerarquía
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has curso data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('id_curso');
    pm.expect(jsonData.data).to.have.property('nombre_curso');
    pm.expect(jsonData.data).to.have.property('unidades');
});
```

---

#### 3. GET Obtener actividades de un curso
- **Método:** GET
- **URL:** `{{base_url}}/api/student/cursos/:cursoId/actividades`
- **Path Variables:**
  - `cursoId`: 1
- **Headers:** `Content-Type: application/json`
- **Descripción:** Obtiene todas las actividades de un curso con estado y estadísticas
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has actividades and estadisticas", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('actividades');
    pm.expect(jsonData.data).to.have.property('estadisticas');
    pm.expect(jsonData.data.actividades).to.be.an('array');
});
```

---

#### 4. GET Obtener actividades pendientes (globales)
- **Método:** GET
- **URL:** `{{base_url}}/api/student/cursos/actividades/pendientes`
- **Headers:** `Content-Type: application/json`
- **Descripción:** Obtiene todas las actividades pendientes de todos los cursos ordenadas por fecha límite
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Each activity has prioridad field", function () {
    var jsonData = pm.response.json();
    if (jsonData.data.length > 0) {
        pm.expect(jsonData.data[0]).to.have.property('prioridad');
        pm.expect(jsonData.data[0]).to.have.property('dias_restantes');
    }
});
```

---

### 📁 MÓDULO: ENTREGAS

#### 5. GET Dashboard del estudiante
- **Método:** GET
- **URL:** `{{base_url}}/api/student/entregas/dashboard`
- **Query Params:**
  - `usuarioId`: `{{usuario_id}}`
- **Headers:** `Content-Type: application/json`
- **Descripción:** Obtiene estadísticas personales del estudiante
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Dashboard has estadisticas", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('total_entregas_realizadas');
    pm.expect(jsonData.data).to.have.property('progreso_general');
});
```

---

#### 6. GET Obtener mis entregas
- **Método:** GET
- **URL:** `{{base_url}}/api/student/entregas`
- **Query Params:**
  - `usuarioId`: `{{usuario_id}}`
- **Headers:** `Content-Type: application/json`
- **Descripción:** Obtiene el historial completo de entregas del estudiante
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has entregas and estadisticas", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('entregas');
    pm.expect(jsonData.data).to.have.property('estadisticas');
});
```

---

#### 7. GET Obtener detalle de una entrega
- **Método:** GET
- **URL:** `{{base_url}}/api/student/entregas/:entregaId`
- **Path Variables:**
  - `entregaId`: 1
- **Query Params:**
  - `usuarioId`: `{{usuario_id}}`
- **Headers:** `Content-Type: application/json`
- **Descripción:** Obtiene el detalle completo de una entrega específica
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Entrega has info_adicional", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('info_adicional');
    pm.expect(jsonData.data.info_adicional).to.have.property('puntualidad');
});
```

---

#### 8. POST Crear nueva entrega
- **Método:** POST
- **URL:** `{{base_url}}/api/student/entregas`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "id_actividad": 1,
  "id_usuario": 1,
  "archivos": [
    {
      "nombre": "tarea_1.pdf",
      "tipo": "pdf",
      "url": "/uploads/tarea_1.pdf"
    }
  ]
}
```
- **Descripción:** Crea una nueva entrega para una actividad
- **Tests:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Entrega creada correctamente", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.expect(jsonData.data).to.have.property('id_entrega');
    pm.expect(jsonData.data).to.have.property('num_intento');
    pm.expect(jsonData.data.num_intento).to.eql(1);
});

// Guardar ID de entrega para otros tests
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("entrega_id", jsonData.data.id_entrega);
}
```

---

#### 9. PUT Actualizar entrega (nuevo intento)
- **Método:** PUT
- **URL:** `{{base_url}}/api/student/entregas/:entregaId`
- **Path Variables:**
  - `entregaId`: `{{entrega_id}}`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "id_usuario": 1,
  "archivos": [
    {
      "nombre": "tarea_1_v2.pdf",
      "tipo": "pdf",
      "url": "/uploads/tarea_1_v2.pdf"
    }
  ]
}
```
- **Descripción:** Actualiza una entrega existente creando un nuevo intento
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Entrega actualizada correctamente", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.expect(jsonData.data.num_intento).to.be.greaterThan(1);
});
```

---

#### 10. DELETE Eliminar entrega
- **Método:** DELETE
- **URL:** `{{base_url}}/api/student/entregas/:entregaId`
- **Path Variables:**
  - `entregaId`: `{{entrega_id}}`
- **Query Params:**
  - `usuarioId`: `{{usuario_id}}`
- **Headers:** `Content-Type: application/json`
- **Descripción:** Elimina una entrega del estudiante (solo antes de fecha límite)
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Entrega eliminada correctamente", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.expect(jsonData.message).to.include('eliminada');
});
```

---

### 📁 UTILIDADES

#### 11. GET Verificar estado del servidor
- **Método:** GET
- **URL:** `{{base_url}}/`
- **Headers:** `Content-Type: application/json`
- **Descripción:** Verifica que el servidor esté corriendo y muestra endpoints disponibles
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Server is running", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('message');
    pm.expect(jsonData.message).to.include('GradIA');
});
```

---

#### 12. GET Verificar salud y conexión a BD
- **Método:** GET
- **URL:** `{{base_url}}/api/health`
- **Headers:** `Content-Type: application/json`
- **Descripción:** Verifica la conexión a la base de datos
- **Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Database is connected", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.status).to.eql('OK');
    pm.expect(jsonData.database).to.eql('Connected');
});
```

---

## 🔄 FLUJO DE TESTING RECOMENDADO

### Flujo 1: Ver cursos y actividades
1. GET Verificar estado del servidor
2. GET Verificar salud y conexión a BD
3. GET Obtener todos mis cursos
4. GET Obtener detalle de un curso (usar ID del paso 3)
5. GET Obtener actividades de un curso
6. GET Obtener actividades pendientes

### Flujo 2: Gestionar entregas
1. GET Dashboard del estudiante
2. GET Obtener mis entregas
3. POST Crear nueva entrega
4. GET Obtener detalle de una entrega (usar ID del paso 3)
5. PUT Actualizar entrega (nuevo intento)
6. GET Obtener mis entregas (verificar cambios)
7. DELETE Eliminar entrega (opcional, solo para testing)

---

## 📊 COLECCIÓN RUNNER

### Test Suite: "Smoke Test - Estudiante"
**Orden de ejecución:**
1. Verificar estado del servidor
2. Verificar salud y conexión a BD
3. Obtener todos mis cursos
4. Dashboard del estudiante

**Criterio de éxito:** Todos los tests pasan (4/4)

---

### Test Suite: "Full Test - Entregas"
**Orden de ejecución:**
1. Obtener mis entregas
2. Crear nueva entrega
3. Obtener detalle de una entrega
4. Actualizar entrega
5. Eliminar entrega

**Criterio de éxito:** Todos los tests pasan (5/5)

---

## 🎨 ORGANIZACIÓN VISUAL EN POSTMAN

### Colores sugeridos:
- 🟦 **MÓDULO: CURSOS** - Azul
- 🟩 **MÓDULO: ENTREGAS** - Verde
- 🟨 **UTILIDADES** - Amarillo

### Iconos:
- 📚 Cursos
- 📝 Entregas
- ⚙️ Utilidades

---

## 📝 NOTAS IMPORTANTES

1. **Autenticación simulada:** Actualmente usa `?usuarioId=1`. En producción implementar JWT.

2. **Variables de entorno:** Crear dos environments (Local y Production) con las variables:
   - `base_url`
   - `usuario_id`
   - `entrega_id` (generado automáticamente en tests)

3. **Validaciones:**
   - Verificar que `success: true` en todas las respuestas exitosas
   - Validar estructura de datos en cada response
   - Guardar IDs importantes en variables de entorno para reutilizar

4. **Tests automáticos:**
   - Cada request incluye tests básicos
   - Tests validan status code y estructura de respuesta
   - Variables se guardan automáticamente para uso posterior

---

## 🚀 EXPORTAR COLECCIÓN

### Formato JSON (Postman Collection v2.1)

**Nombre del archivo:** `Gradia-Module-Manager-Student.postman_collection.json`

**Metadata:**
```json
{
  "info": {
    "name": "Gradia-Module-Manager-Student",
    "description": "API Backend para vista de estudiante del sistema GradIA",
    "version": "1.0.0",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  }
}
```

---

**Última actualización:** 2025-10-10
**Versión:** 1.0.0
**Total Requests:** 12
**Total Carpetas:** 3
