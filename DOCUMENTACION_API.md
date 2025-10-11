# 📚 DOCUMENTACIÓN API - GradIA Module Manager Student

## Información General
- **Versión**: 1.0.0
- **Base URL**: `http://localhost:3001`
- **Base de Datos**: PostgreSQL en Render.com (compartida con backend docente)
- **Total de Endpoints**: 10
- **Completitud**: 100% ✅ (funcionalidades básicas)

---

## 📊 MÓDULOS IMPLEMENTADOS

### 1. Visualización de Cursos (4 endpoints)
### 2. Gestión de Entregas (6 endpoints)

---

## 1️⃣ VISUALIZACIÓN DE CURSOS (4 endpoints)

### 📌 **CURSOS Y ACTIVIDADES** - Vista Estudiante

#### GET /api/student/cursos
Obtener todos mis cursos activos con su jerarquía completa

**Request:**
```bash
curl http://localhost:3001/api/student/cursos
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

**Características:**
- Solo muestra cursos con `estado: 'activo'`
- Ordenado alfabéticamente por nombre de curso
- Incluye jerarquía completa: Curso → Unidad → Actividad
- Calcula estadísticas automáticamente
- Unidades ordenadas por `numero_unidad`
- Actividades ordenadas por `created_at`

---

#### GET /api/student/cursos/:id
Obtener el detalle completo de un curso específico

**Request:**
```bash
curl http://localhost:3001/api/student/cursos/1
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
            "id_rubrica": null
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

#### GET /api/student/cursos/:cursoId/actividades
Obtener todas las actividades de un curso con información de estado y prioridad

**Request:**
```bash
curl http://localhost:3001/api/student/cursos/1/actividades
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

**Características:**
- `estado_para_estudiante`: "pendiente" o "vencida" (calculado en tiempo real)
- `dias_restantes`: Días hasta la fecha límite (negativos si ya venció)
- Incluye información de unidad
- Estadísticas agrupadas por estado y tipo
- Ordenado por unidad → fecha de creación

---

#### GET /api/student/cursos/actividades/pendientes
Obtener todas las actividades pendientes de TODOS los cursos activos (Dashboard)

**Request:**
```bash
curl http://localhost:3001/api/student/cursos/actividades/pendientes
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

**Características:**
- Solo incluye actividades futuras o sin fecha límite
- Ordenado por fecha límite ascendente (más urgentes primero)
- `prioridad`: Calculada automáticamente
  - "urgente": ≤ 1 día
  - "alta": ≤ 3 días
  - "media": ≤ 7 días
  - "normal": > 7 días o sin fecha límite
- Incluye información completa de curso → unidad
- Filtra solo cursos con `estado: 'activo'`

---

## 2️⃣ GESTIÓN DE ENTREGAS (6 endpoints)

### 📌 **ENTREGAS** - Vista Estudiante

#### GET /api/student/entregas/dashboard
Obtener dashboard personal con estadísticas del estudiante

**Request:**
```bash
curl http://localhost:3001/api/student/entregas/dashboard?usuarioId=1
```

**Query Parameters:**
- `usuarioId` (integer, opcional) - ID del usuario (temporal: simula autenticación, default: 1)

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

**Características:**
- `total_entregas_realizadas`: Conteo total de entregas del estudiante
- `entregas_esta_semana`: Entregas de los últimos 7 días
- `actividades_disponibles`: Total de actividades en el sistema
- `progreso_general`: Porcentaje de avance (entregas/actividades * 100)

---

#### GET /api/student/entregas
Obtener el historial completo de mis entregas

**Request:**
```bash
curl http://localhost:3001/api/student/entregas?usuarioId=1
```

**Query Parameters:**
- `usuarioId` (integer, opcional) - ID del usuario (temporal, default: 1)

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
      },
      {
        "id_entrega": 12,
        "fecha_entrega": "2025-10-06T23:59:00.000Z",
        "id_actividad": 3,
        "id_usuario": 1,
        "num_intento": 2,
        "puntualidad": "tardio"
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

**Características:**
- Ordenado por `fecha_entrega` descendente (más recientes primero)
- `puntualidad`: "a_tiempo" o "tardio" (comparando fecha_entrega vs fecha_limite)
- Incluye jerarquía completa de la actividad
- Incluye todos los archivos adjuntos
- `num_intento`: Número de intento (1 = primera entrega, 2+ = reenvíos)
- Estadísticas agregadas de todas las entregas

---

#### GET /api/student/entregas/:id
Obtener el detalle completo de una entrega específica

**Request:**
```bash
curl http://localhost:3001/api/student/entregas/15?usuarioId=1
```

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

**Características:**
- Solo puede ver SUS PROPIAS entregas (validación por `id_usuario`)
- `dias_diferencia`: Días de diferencia entre entrega y límite (negativo = antes del límite)
- `puede_reenviar`: Lógica para determinar si puede hacer otro intento
- Incluye información completa de la actividad y el curso

---

#### POST /api/student/entregas
Crear una nueva entrega (enviar tarea)

**Request:**
```bash
curl -X POST http://localhost:3001/api/student/entregas \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

**📋 Validaciones:**
| Campo | Requerido | Regla |
|-------|-----------|-------|
| `id_actividad` | ✅ Sí | La actividad debe existir en la BD |
| `id_usuario` | ❌ No | ID del usuario (temporal, default: 1) |
| `archivos` | ❌ No | Array de archivos a adjuntar |
| **Restricción** | - | No permite entregas después de la fecha límite |
| **Restricción** | - | No permite entregas duplicadas en actividades individuales |

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
      }
    ]
  },
  "message": "Entrega creada exitosamente"
}
```

**Response (400 Bad Request - Campo obligatorio):**
```json
{
  "success": false,
  "message": "El campo id_actividad es obligatorio"
}
```

**Response (404 Not Found):**
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

**Response (400 Bad Request - Entrega duplicada):**
```json
{
  "success": false,
  "message": "Ya tienes una entrega para esta actividad. Usa PUT para actualizar.",
  "entrega_existente": 15
}
```

---

#### PUT /api/student/entregas/:id
Actualizar una entrega existente (nuevo intento)

**Request:**
```bash
curl -X PUT http://localhost:3001/api/student/entregas/15 \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": 1,
    "archivos": [
      {
        "nombre": "proyecto_final_v2.pdf",
        "tipo": "pdf",
        "url": "/uploads/proyecto_final_v2.pdf"
      }
    ]
  }'
```

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
        "id_archivo_entrega": 22,
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

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "No puedes actualizar la entrega después de la fecha límite"
}
```

**Características:**
- Solo puede actualizar SUS PROPIAS entregas
- Incrementa `num_intento` automáticamente
- Actualiza `fecha_entrega` al momento actual
- Los archivos nuevos se agregan SIN eliminar los anteriores
- Cada archivo tiene su `version` correspondiente al número de intento
- Verifica que no haya pasado la fecha límite

---

#### DELETE /api/student/entregas/:id
Eliminar mi entrega (solo antes de la fecha límite)

**Request:**
```bash
curl -X DELETE http://localhost:3001/api/student/entregas/15?usuarioId=1
```

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

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "No puedes eliminar la entrega después de la fecha límite"
}
```

**Características:**
- Solo puede eliminar SUS PROPIAS entregas (validación por `id_usuario`)
- Elimina primero todos los `ArchivoEntrega` asociados
- Solo permite eliminación ANTES de la fecha límite
- Útil para casos donde el estudiante se equivocó y quiere volver a enviar desde cero

---

## 📋 CÓDIGOS DE ESTADO HTTP

### Códigos de Éxito
- **200 OK**: Operación exitosa (GET, PUT, DELETE)
- **201 Created**: Recurso creado exitosamente (POST)

### Códigos de Error del Cliente
- **400 Bad Request**: Datos inválidos o validación fallida
- **403 Forbidden**: Sin permisos para realizar la operación
- **404 Not Found**: Recurso no encontrado

### Códigos de Error del Servidor
- **500 Internal Server Error**: Error interno del servidor

---

## 🔧 FORMATO DE RESPUESTAS

### Respuesta Exitosa
```json
{
  "success": true,
  "data": { ... } | [ ... ],
  "message": "Descripción de la operación exitosa"
}
```

### Respuesta de Error
```json
{
  "success": false,
  "message": "Descripción del error para el usuario",
  "error": "Detalles técnicos (solo en desarrollo)"
}
```

---

## 🚀 ENDPOINTS DE UTILIDAD

### GET /
Información general de la API

**Response:**
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

### GET /api/health
Verificar estado de la API y conexión a la base de datos

**Response:**
```json
{
  "status": "OK",
  "database": "Connected",
  "message": "Vista Estudiante - Conexión exitosa",
  "timestamp": "2025-10-11T12:00:00.000Z"
}
```

---

## 📊 ARQUITECTURA DE LA BASE DE DATOS

### Jerarquía de Entidades (Vista Estudiante)
```
CURSO (Vista) → UNIDAD (Vista) → ACTIVIDAD (Vista) → ENTREGA (Gestión)
                                                          ↓
                                                   ARCHIVO_ENTREGA
```

### Schemas PostgreSQL (Compartidos con Backend Docente)

#### Schemas Activos en Backend Estudiante:
1. **cursos**: `curso`, `unidad`
2. **actividades**: `actividad`, `entrega`, `archivo_entrega`
3. **usuario**: `usuario`

#### Schemas Disponibles para Futuras Implementaciones:
4. **evaluaciones**: `rubrica`, `criterio`, `rubrica_criterio`, `nivel_criterio`, `evaluacion`, `evaluacion_documento`
5. **actividades** (extendido): `comentario`, `documento_actividad`
6. **grupos**: `grupo`, `miembro_grupo`
7. **permisos**: `permiso`, `rol`, `rol_permiso`
8. **refresh_token**: `refresh_token`

**⚠️ NOTA:** La tabla `sesion` fue eliminada. Las actividades se conectan directamente con unidades mediante `id_unidad`.

---

## 🎯 EJEMPLOS DE FLUJOS COMPLETOS

### Flujo 1: Estudiante entrega una tarea
```javascript
// 1. Ver actividades pendientes
GET /api/student/cursos/actividades/pendientes

// 2. Ver detalle del curso y actividad específica
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

// 4. Ver historial de mis entregas
GET /api/student/entregas

// 5. Ver dashboard personal
GET /api/student/entregas/dashboard
```

### Flujo 2: Estudiante reenvía una tarea
```javascript
// 1. Ver detalle de mi entrega anterior
GET /api/student/entregas/15

// 2. Actualizar la entrega (nuevo intento)
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

// 3. Verificar que se actualizó correctamente
GET /api/student/entregas/15
// num_intento ahora es 2
```

### Flujo 3: Estudiante elimina entrega por error
```javascript
// 1. Ver mis entregas
GET /api/student/entregas

// 2. Eliminar la entrega (solo antes de fecha límite)
DELETE /api/student/entregas/15

// 3. Volver a crear la entrega correcta
POST /api/student/entregas
{
  "id_actividad": 5,
  "archivos": [...]
}
```

---

## 🔐 NOTA DE SEGURIDAD

⚠️ **IMPORTANTE:** Actualmente el sistema simula autenticación mediante query parameter `?usuarioId=X`.

### En producción se debe implementar:

1. **JWT Authentication**
   - Token en header: `Authorization: Bearer <token>`
   - Extraer `id_usuario` del token decodificado
   - Eliminar query parameter `usuarioId`

2. **Validación de Permisos**
   - Middleware que valide que el token pertenece a un estudiante
   - Verificar que el estudiante solo acceda a SUS recursos
   - Validar inscripciones a cursos

3. **Validación de Archivos**
   - Implementar Multer middleware
   - Validar tipos de archivo permitidos
   - Limitar tamaño máximo de archivos
   - Escanear archivos por virus

**Ejemplo de header en producción:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## 📞 SOPORTE

Para reportar bugs o solicitar funcionalidades:
- **Repositorio**: GitHub - GradIA Module Manager Student
- **Contacto**: equipo-gradia@universidad.edu

---

**Última actualización**: 2025-10-11
**Versión del documento**: 1.0
