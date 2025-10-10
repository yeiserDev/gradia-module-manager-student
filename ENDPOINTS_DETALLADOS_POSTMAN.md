# 📮 ENDPOINTS DETALLADOS - BACKEND ESTUDIANTE

**Base URL:** `http://localhost:3001`
**Total Endpoints:** 10 + 2 utilidades

---

## 📁 MÓDULO: CURSOS

### 1. GET Obtener todos mis cursos

**Endpoint:** `GET /api/student/cursos`

**Request:**
```
GET http://localhost:3001/api/student/cursos
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id_curso": 1,
      "nombre_curso": "Programación Avanzada",
      "descripcion": "Curso de algoritmos y estructuras de datos",
      "estado": "activo",
      "unidades": [
        {
          "id_unidad": 1,
          "titulo_unidad": "Unidad 1: Ordenamiento",
          "numero_unidad": 1,
          "actividades": [
            {
              "id_actividad": 1,
              "nombre_actividad": "Tarea 1: Bubble Sort",
              "fecha_limite": "2025-12-31T23:59:59.000Z",
              "tipo_actividad": "individual"
            }
          ]
        }
      ],
      "estadisticas": {
        "total_unidades": 4,
        "total_actividades": 12
      }
    }
  ],
  "message": "Cursos obtenidos exitosamente"
}
```

---

### 2. GET Obtener detalle de un curso

**Endpoint:** `GET /api/student/cursos/:cursoId`

**Request:**
```
GET http://localhost:3001/api/student/cursos/1
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id_curso": 1,
    "nombre_curso": "Programación Avanzada",
    "descripcion": "Curso de algoritmos y estructuras de datos",
    "estado": "activo",
    "id_usuario": 1,
    "created_at": "2025-09-16T12:00:00.000Z",
    "updated_at": "2025-09-16T12:00:00.000Z",
    "unidades": [
      {
        "id_unidad": 1,
        "titulo_unidad": "Unidad 1: Ordenamiento",
        "descripcion": "Algoritmos de ordenamiento",
        "numero_unidad": 1,
        "actividades": [
          {
            "id_actividad": 1,
            "nombre_actividad": "Implementar Bubble Sort",
            "descripcion": "Implementar el algoritmo en JavaScript",
            "fecha_limite": "2025-10-15T23:59:59.000Z",
            "tipo_actividad": "individual",
            "id_unidad": 1,
            "id_usuario": 1,
            "id_rubrica": null,
            "created_at": "2025-09-16T12:00:00.000Z",
            "updated_at": "2025-09-16T12:00:00.000Z"
          }
        ]
      }
    ]
  },
  "message": "Detalle del curso obtenido exitosamente"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Curso no encontrado"
}
```

---

### 3. GET Obtener actividades de un curso

**Endpoint:** `GET /api/student/cursos/:cursoId/actividades`

**Request:**
```
GET http://localhost:3001/api/student/cursos/1/actividades
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "actividades": [
      {
        "id_actividad": 1,
        "nombre_actividad": "Implementar Bubble Sort",
        "descripcion": "Implementar el algoritmo en JavaScript",
        "fecha_limite": "2025-10-15T23:59:59.000Z",
        "tipo_actividad": "individual",
        "id_unidad": 1,
        "id_usuario": 1,
        "id_rubrica": null,
        "created_at": "2025-09-16T12:00:00.000Z",
        "updated_at": "2025-09-16T12:00:00.000Z",
        "unidad": {
          "titulo_unidad": "Unidad 1: Ordenamiento",
          "numero_unidad": 1
        },
        "estado_para_estudiante": "pendiente",
        "dias_restantes": 5
      },
      {
        "id_actividad": 2,
        "nombre_actividad": "Quiz de Ordenamiento",
        "fecha_limite": "2025-10-05T23:59:59.000Z",
        "tipo_actividad": "individual",
        "estado_para_estudiante": "vencida",
        "dias_restantes": -5
      }
    ],
    "estadisticas": {
      "total": 12,
      "pendientes": 8,
      "vencidas": 4,
      "individuales": 10,
      "grupales": 2
    }
  },
  "message": "Actividades del curso obtenidas exitosamente"
}
```

---

### 4. GET Obtener actividades pendientes (globales)

**Endpoint:** `GET /api/student/cursos/actividades/pendientes`

**Request:**
```
GET http://localhost:3001/api/student/cursos/actividades/pendientes
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id_actividad": 5,
      "nombre_actividad": "Proyecto Final",
      "descripcion": "Proyecto integrador del curso",
      "fecha_limite": "2025-10-12T23:59:59.000Z",
      "tipo_actividad": "grupal",
      "unidad": {
        "titulo_unidad": "Unidad 4: Proyecto Final",
        "curso": {
          "nombre_curso": "Programación Avanzada"
        }
      },
      "dias_restantes": 2,
      "prioridad": "alta"
    },
    {
      "id_actividad": 3,
      "nombre_actividad": "Tarea de Estructuras",
      "fecha_limite": "2025-10-20T23:59:59.000Z",
      "tipo_actividad": "individual",
      "dias_restantes": 10,
      "prioridad": "media"
    },
    {
      "id_actividad": 8,
      "nombre_actividad": "Lectura Opcional",
      "fecha_limite": null,
      "tipo_actividad": "individual",
      "dias_restantes": null,
      "prioridad": "normal"
    }
  ],
  "message": "Actividades pendientes obtenidas exitosamente"
}
```

---

## 📁 MÓDULO: ENTREGAS

### 5. GET Dashboard del estudiante

**Endpoint:** `GET /api/student/entregas/dashboard`

**Request:**
```
GET http://localhost:3001/api/student/entregas/dashboard?usuarioId=1
Content-Type: application/json
```

**Query Parameters:**
- `usuarioId`: 1 (opcional, default: 1)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_entregas_realizadas": 8,
    "entregas_esta_semana": 2,
    "actividades_disponibles": 12,
    "progreso_general": 67
  },
  "message": "Dashboard del estudiante obtenido exitosamente"
}
```

---

### 6. GET Obtener mis entregas

**Endpoint:** `GET /api/student/entregas`

**Request:**
```
GET http://localhost:3001/api/student/entregas?usuarioId=1
Content-Type: application/json
```

**Query Parameters:**
- `usuarioId`: 1 (opcional, default: 1)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "entregas": [
      {
        "id_entrega": 15,
        "fecha_entrega": "2025-10-10T08:30:00.000Z",
        "id_actividad": 5,
        "id_usuario": 1,
        "id_grupo": null,
        "num_intento": 1,
        "created_at": "2025-10-10T08:30:00.000Z",
        "updated_at": "2025-10-10T08:30:00.000Z",
        "actividad": {
          "id_actividad": 5,
          "nombre_actividad": "Proyecto Final",
          "fecha_limite": "2025-10-12T23:59:59.000Z",
          "tipo_actividad": "grupal",
          "unidad": {
            "titulo_unidad": "Unidad 4: Proyecto Final",
            "curso": {
              "nombre_curso": "Programación Avanzada"
            }
          }
        },
        "archivos": [
          {
            "id_archivo_entrega": 20,
            "nombre_archivo": "proyecto_final.pdf",
            "tipo_archivo": "pdf",
            "url_archivo": "/uploads/proyecto_final.pdf",
            "created_at": "2025-10-10T08:30:00.000Z"
          }
        ],
        "estado_entrega": "entregado",
        "puntualidad": "a_tiempo",
        "total_archivos": 1
      }
    ],
    "estadisticas": {
      "total_entregas": 8,
      "entregas_a_tiempo": 6,
      "entregas_tardias": 2,
      "entregas_individuales": 7,
      "entregas_grupales": 1
    }
  },
  "message": "Mis entregas obtenidas exitosamente"
}
```

---

### 7. GET Obtener detalle de una entrega

**Endpoint:** `GET /api/student/entregas/:entregaId`

**Request:**
```
GET http://localhost:3001/api/student/entregas/15?usuarioId=1
Content-Type: application/json
```

**Path Parameters:**
- `entregaId`: 15

**Query Parameters:**
- `usuarioId`: 1 (opcional, default: 1)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id_entrega": 15,
    "fecha_entrega": "2025-10-10T08:30:00.000Z",
    "id_actividad": 5,
    "id_usuario": 1,
    "id_grupo": null,
    "num_intento": 1,
    "actividad": {
      "id_actividad": 5,
      "nombre_actividad": "Proyecto Final",
      "descripcion": "Proyecto integrador del curso",
      "fecha_limite": "2025-10-12T23:59:59.000Z",
      "tipo_actividad": "grupal",
      "unidad": {
        "titulo_unidad": "Unidad 4: Proyecto Final",
        "curso": {
          "nombre_curso": "Programación Avanzada"
        }
      }
    },
    "archivos": [
      {
        "id_archivo_entrega": 20,
        "nombre_archivo": "proyecto_final.pdf",
        "tipo_archivo": "pdf",
        "url_archivo": "/uploads/proyecto_final.pdf",
        "version": 1,
        "hash_contenido": null,
        "created_at": "2025-10-10T08:30:00.000Z"
      }
    ],
    "info_adicional": {
      "puntualidad": "a_tiempo",
      "dias_diferencia": -2,
      "puede_reenviar": true,
      "total_archivos": 1,
      "total_mb": 0
    }
  },
  "message": "Detalle de entrega obtenido exitosamente"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Entrega no encontrada o no tienes permisos para verla"
}
```

---

### 8. POST Crear nueva entrega

**Endpoint:** `POST /api/student/entregas`

**Request:**
```
POST http://localhost:3001/api/student/entregas
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "id_actividad": 5,
  "id_usuario": 1,
  "archivos": [
    {
      "nombre": "proyecto_final.pdf",
      "tipo": "pdf",
      "url": "/uploads/proyecto_final.pdf"
    },
    {
      "nombre": "codigo_fuente.zip",
      "tipo": "zip",
      "url": "/uploads/codigo_fuente.zip"
    }
  ]
}
```

**Campos Requeridos:**
- `id_actividad` (integer): ID de la actividad a entregar

**Campos Opcionales:**
- `id_usuario` (integer): ID del usuario (temporal, default: 1)
- `archivos` (array): Array de archivos a adjuntar

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id_entrega": 16,
    "fecha_entrega": "2025-10-10T12:00:00.000Z",
    "id_actividad": 5,
    "id_usuario": 1,
    "id_grupo": null,
    "num_intento": 1,
    "created_at": "2025-10-10T12:00:00.000Z",
    "updated_at": "2025-10-10T12:00:00.000Z",
    "actividad": {
      "nombre_actividad": "Proyecto Final",
      "tipo_actividad": "grupal",
      "fecha_limite": "2025-10-12T23:59:59.000Z"
    },
    "archivos": [
      {
        "id_archivo_entrega": 21,
        "nombre_archivo": "proyecto_final.pdf",
        "tipo_archivo": "pdf",
        "url_archivo": "/uploads/proyecto_final.pdf",
        "version": 1
      },
      {
        "id_archivo_entrega": 22,
        "nombre_archivo": "codigo_fuente.zip",
        "tipo_archivo": "zip",
        "url_archivo": "/uploads/codigo_fuente.zip",
        "version": 1
      }
    ]
  },
  "message": "Entrega creada exitosamente"
}
```

**Response (400 Bad Request - Campo obligatorio faltante):**
```json
{
  "success": false,
  "message": "El campo id_actividad es obligatorio"
}
```

**Response (404 Not Found - Actividad no existe):**
```json
{
  "success": false,
  "message": "La actividad especificada no existe"
}
```

**Response (400 Bad Request - Fecha límite pasada):**
```json
{
  "success": false,
  "message": "La fecha límite para esta actividad ya ha pasado",
  "fecha_limite": "2025-10-05T23:59:59.000Z"
}
```

**Response (400 Bad Request - Ya existe entrega):**
```json
{
  "success": false,
  "message": "Ya tienes una entrega para esta actividad. Usa PUT para actualizar.",
  "entrega_existente": 15
}
```

---

### 9. PUT Actualizar entrega (nuevo intento)

**Endpoint:** `PUT /api/student/entregas/:entregaId`

**Request:**
```
PUT http://localhost:3001/api/student/entregas/15
Content-Type: application/json
```

**Path Parameters:**
- `entregaId`: 15

**Body (JSON):**
```json
{
  "id_usuario": 1,
  "archivos": [
    {
      "nombre": "proyecto_final_v2.pdf",
      "tipo": "pdf",
      "url": "/uploads/proyecto_final_v2.pdf"
    }
  ]
}
```

**Campos Opcionales:**
- `id_usuario` (integer): ID del usuario (temporal, default: 1)
- `archivos` (array): Array de nuevos archivos a adjuntar

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id_entrega": 15,
    "fecha_entrega": "2025-10-11T14:30:00.000Z",
    "id_actividad": 5,
    "id_usuario": 1,
    "num_intento": 2,
    "updated_at": "2025-10-11T14:30:00.000Z",
    "actividad": {
      "nombre_actividad": "Proyecto Final",
      "tipo_actividad": "grupal",
      "fecha_limite": "2025-10-12T23:59:59.000Z"
    },
    "archivos": [
      {
        "id_archivo_entrega": 20,
        "nombre_archivo": "proyecto_final.pdf",
        "version": 1
      },
      {
        "id_archivo_entrega": 23,
        "nombre_archivo": "proyecto_final_v2.pdf",
        "version": 2
      }
    ]
  },
  "message": "Entrega actualizada exitosamente (Intento #2)"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Entrega no encontrada o no tienes permisos para actualizarla"
}
```

**Response (400 Bad Request - Fecha límite pasada):**
```json
{
  "success": false,
  "message": "No puedes actualizar la entrega después de la fecha límite"
}
```

---

### 10. DELETE Eliminar entrega

**Endpoint:** `DELETE /api/student/entregas/:entregaId`

**Request:**
```
DELETE http://localhost:3001/api/student/entregas/15?usuarioId=1
Content-Type: application/json
```

**Path Parameters:**
- `entregaId`: 15

**Query Parameters:**
- `usuarioId`: 1 (opcional, default: 1)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Entrega eliminada exitosamente"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Entrega no encontrada o no tienes permisos para eliminarla"
}
```

**Response (400 Bad Request - Fecha límite pasada):**
```json
{
  "success": false,
  "message": "No puedes eliminar la entrega después de la fecha límite"
}
```

---

## 📁 UTILIDADES

### 11. GET Verificar estado del servidor

**Endpoint:** `GET /`

**Request:**
```
GET http://localhost:3001/
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "message": "API de GradIA - Vista Estudiante",
  "version": "1.0.0",
  "status": "Configuración inicial completada",
  "endpoints": {
    "health": "/api/health",
    "mis_cursos": "/api/student/cursos",
    "actividades_pendientes": "/api/student/cursos/actividades/pendientes",
    "mis_entregas": "/api/student/entregas",
    "dashboard": "/api/student/entregas/dashboard"
  }
}
```

---

### 12. GET   

**Endpoint:** `GET /api/health`

**Request:**
```
GET http://localhost:3001/api/health
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "status": "OK",
  "database": "Connected",
  "message": "Vista Estudiante - Conexión exitosa",
  "timestamp": "2025-10-10T12:00:00.000Z"
}
```

**Response (500 Internal Server Error):**
```json
{
  "status": "ERROR",
  "database": "Disconnected",
  "error": "Connection timeout",
  "timestamp": "2025-10-10T12:00:00.000Z"
}
```

---

## 📋 RESUMEN DE CÓDIGOS HTTP

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| 200 | OK | GET, PUT, DELETE exitosos |
| 201 | Created | POST exitoso (entrega creada) |
| 400 | Bad Request | Validaciones fallidas, campos faltantes, fecha límite pasada |
| 404 | Not Found | Recurso no encontrado, sin permisos |
| 500 | Internal Server Error | Error del servidor, BD desconectada |

---

## 🎯 EJEMPLOS DE FLUJOS COMPLETOS

### Flujo 1: Estudiante entrega una tarea

```javascript
// 1. Ver actividades pendientes
GET /api/student/cursos/actividades/pendientes

// 2. Ver detalle de la actividad específica
GET /api/student/cursos/1/actividades

// 3. Crear la entrega
POST /api/student/entregas
{
  "id_actividad": 5,
  "archivos": [
    {
      "nombre": "tarea.pdf",
      "tipo": "pdf",
      "url": "/uploads/tarea.pdf"
    }
  ]
}

// 4. Verificar en mis entregas
GET /api/student/entregas
```

---

### Flujo 2: Estudiante reenvía una tarea

```javascript
// 1. Ver mis entregas
GET /api/student/entregas

// 2. Ver detalle de la entrega
GET /api/student/entregas/15

// 3. Actualizar la entrega (nuevo intento)
PUT /api/student/entregas/15
{
  "archivos": [
    {
      "nombre": "tarea_v2.pdf",
      "tipo": "pdf",
      "url": "/uploads/tarea_v2.pdf"
    }
  ]
}

// 4. Verificar el cambio
GET /api/student/entregas/15
// Ahora num_intento = 2
```

---

### Flujo 3: Estudiante elimina una entrega por error

```javascript
// 1. Ver mis entregas
GET /api/student/entregas

// 2. Eliminar la entrega
DELETE /api/student/entregas/15

// 3. Volver a crear la entrega correcta
POST /api/student/entregas
{
  "id_actividad": 5,
  "archivos": [...]
}
```

---

## 🔐 NOTAS DE SEGURIDAD

⚠️ **IMPORTANTE:** La autenticación actual es simulada mediante `?usuarioId=1`

En **producción** se debe:
1. Implementar JWT Authentication
2. Enviar token en header: `Authorization: Bearer <token>`
3. Extraer `id_usuario` del token decodificado
4. Eliminar query parameter `usuarioId`

**Ejemplo de header en producción:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

**Última actualización:** 2025-10-10
**Versión:** 1.0.0
**Puerto:** 3001
**Base URL Local:** http://localhost:3001
