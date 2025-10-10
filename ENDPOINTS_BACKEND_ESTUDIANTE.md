# 📚 DOCUMENTACIÓN COMPLETA - ENDPOINTS BACKEND ESTUDIANTE

**Proyecto:** GradIA - Module Manager Student
**Versión:** 1.0.0
**Puerto:** 3001
**Base URL:** `http://localhost:3001`
**Total de Endpoints:** 10
**Arquitectura:** Curso → Unidad → Actividad (sin sesiones)

---

## 📑 ÍNDICE

1. [Visualización de Cursos (4 endpoints)](#1-visualización-de-cursos)
2. [Gestión de Entregas (6 endpoints)](#2-gestión-de-entregas)

---

## 1. VISUALIZACIÓN DE CURSOS

### 1.1 Obtener Todos Mis Cursos

**Descripción:** Obtiene todos los cursos activos disponibles con su jerarquía completa (unidades → actividades) y estadísticas.

**Endpoint:** `GET /api/student/cursos`

**Query Parameters:**
- Ninguno (por ahora muestra todos los cursos activos, futuro: filtrar por inscripciones)

**Respuesta Exitosa (200):**
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
              "nombre_actividad": "Tarea 1",
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

### 1.2 Obtener Detalle de un Curso Específico

**Descripción:** Obtiene el detalle completo de un curso específico con toda su estructura jerárquica.

**Endpoint:** `GET /api/student/cursos/:cursoId`

**URL Parameters:**
- `cursoId` (integer, requerido) - ID del curso

**Ejemplo:** `GET /api/student/cursos/1`

**Respuesta Exitosa (200):**
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

**Error 404:**
```json
{
  "success": false,
  "message": "Curso no encontrado"
}
```

---

### 1.3 Obtener Actividades de un Curso Específico

**Descripción:** Obtiene todas las actividades de un curso específico con información de estado, prioridad y días restantes.

**Endpoint:** `GET /api/student/cursos/:cursoId/actividades`

**URL Parameters:**
- `cursoId` (integer, requerido) - ID del curso

**Ejemplo:** `GET /api/student/cursos/1/actividades`

**Respuesta Exitosa (200):**
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

**Características:**
- `estado_para_estudiante`: "pendiente" o "vencida" (calculado en tiempo real)
- `dias_restantes`: Días hasta la fecha límite (negativos si ya venció)
- Incluye información de unidad
- Estadísticas agrupadas por estado y tipo
- Ordenado por unidad → fecha de creación

---

### 1.4 Obtener Actividades Pendientes (Globales)

**Descripción:** Obtiene todas las actividades pendientes de TODOS los cursos activos, ordenadas por fecha límite. Ideal para dashboard principal.

**Endpoint:** `GET /api/student/cursos/actividades/pendientes`

**Query Parameters:**
- Ninguno

**Respuesta Exitosa (200):**
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

## 2. GESTIÓN DE ENTREGAS

### 2.1 Dashboard Personal del Estudiante

**Descripción:** Obtiene estadísticas personalizadas del estudiante con resumen de entregas y progreso general.

**Endpoint:** `GET /api/student/entregas/dashboard`

**Query Parameters:**
- `usuarioId` (integer, opcional) - ID del usuario (temporal: simula autenticación, default: 1)

**Ejemplo:** `GET /api/student/entregas/dashboard?usuarioId=1`

**Respuesta Exitosa (200):**
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

### 2.2 Obtener Todas Mis Entregas

**Descripción:** Obtiene el historial completo de entregas del estudiante con información de puntualidad y estadísticas.

**Endpoint:** `GET /api/student/entregas`

**Query Parameters:**
- `usuarioId` (integer, opcional) - ID del usuario (temporal: simula autenticación, default: 1)

**Ejemplo:** `GET /api/student/entregas?usuarioId=1`

**Respuesta Exitosa (200):**
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

### 2.3 Obtener Detalle de una Entrega Específica

**Descripción:** Obtiene el detalle completo de UNA entrega específica del estudiante.

**Endpoint:** `GET /api/student/entregas/:entregaId`

**URL Parameters:**
- `entregaId` (integer, requerido) - ID de la entrega

**Query Parameters:**
- `usuarioId` (integer, opcional) - ID del usuario (temporal, default: 1)

**Ejemplo:** `GET /api/student/entregas/15?usuarioId=1`

**Respuesta Exitosa (200):**
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

**Error 404:**
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

### 2.4 Crear Nueva Entrega (ENVIAR TAREA)

**Descripción:** Crea una nueva entrega para una actividad. Valida fecha límite y previene duplicados en actividades individuales.

**Endpoint:** `POST /api/student/entregas`

**Body Parameters:**
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
- `id_actividad` (integer) - ID de la actividad

**Campos Opcionales:**
- `id_usuario` (integer) - ID del usuario (temporal, default: 1)
- `archivos` (array) - Array de archivos a adjuntar

**Respuesta Exitosa (201):**
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
      }
    ]
  },
  "message": "Entrega creada exitosamente"
}
```

**Validaciones y Errores:**

**Error 400 - Campo obligatorio faltante:**
```json
{
  "success": false,
  "message": "El campo id_actividad es obligatorio"
}
```

**Error 404 - Actividad no existe:**
```json
{
  "success": false,
  "message": "La actividad especificada no existe"
}
```

**Error 400 - Fecha límite pasada:**
```json
{
  "success": false,
  "message": "La fecha límite para esta actividad ya ha pasado",
  "fecha_limite": "2025-10-05T23:59:59.000Z"
}
```

**Error 400 - Ya existe entrega (actividades individuales):**
```json
{
  "success": false,
  "message": "Ya tienes una entrega para esta actividad. Usa PUT para actualizar.",
  "entrega_existente": 15
}
```

**Características:**
- Valida que la actividad exista y esté disponible
- Verifica que no haya pasado la fecha límite
- Previene entregas duplicadas en actividades individuales
- Crea `ArchivoEntrega` por cada archivo en el array
- `num_intento` inicia en 1
- `fecha_entrega` se establece automáticamente al momento actual

---

### 2.5 Actualizar Entrega Existente (NUEVO INTENTO)

**Descripción:** Actualiza una entrega existente creando un nuevo intento. Permite reenviar la tarea antes de la fecha límite.

**Endpoint:** `PUT /api/student/entregas/:entregaId`

**URL Parameters:**
- `entregaId` (integer, requerido) - ID de la entrega a actualizar

**Body Parameters:**
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
- `id_usuario` (integer) - ID del usuario (temporal, default: 1)
- `archivos` (array) - Array de nuevos archivos a adjuntar

**Respuesta Exitosa (200):**
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

**Validaciones y Errores:**

**Error 404 - Entrega no encontrada:**
```json
{
  "success": false,
  "message": "Entrega no encontrada o no tienes permisos para actualizarla"
}
```

**Error 400 - Fecha límite pasada:**
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

### 2.6 Eliminar Mi Entrega

**Descripción:** Elimina una entrega del estudiante. Solo se puede eliminar ANTES de la fecha límite.

**Endpoint:** `DELETE /api/student/entregas/:entregaId`

**URL Parameters:**
- `entregaId` (integer, requerido) - ID de la entrega a eliminar

**Query Parameters:**
- `usuarioId` (integer, opcional) - ID del usuario (temporal, default: 1)

**Ejemplo:** `DELETE /api/student/entregas/15?usuarioId=1`

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Entrega eliminada exitosamente"
}
```

**Validaciones y Errores:**

**Error 404 - Entrega no encontrada:**
```json
{
  "success": false,
  "message": "Entrega no encontrada o no tienes permisos para eliminarla"
}
```

**Error 400 - Fecha límite pasada:**
```json
{
  "success": false,
  "message": "No puedes eliminar la entrega después de la fecha límite"
}
```

**Características:**
- Solo puede eliminar SUS PROPIAS entregas (validación por `id_usuario`)
- Elimina primero todos los `ArchivoEntrega` asociados
- Luego elimina la entrega
- Solo permite eliminación ANTES de la fecha límite
- Útil para casos donde el estudiante se equivocó y quiere volver a enviar desde cero

---

## 📊 RESUMEN DE CÓDIGOS HTTP

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| 200 | OK | GET, PUT, DELETE exitosos |
| 201 | Created | POST exitoso (entrega creada) |
| 400 | Bad Request | Validaciones fallidas, campos faltantes |
| 403 | Forbidden | Sin permisos (futuro con autenticación real) |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error del servidor |

---

## 🔒 NOTAS DE SEGURIDAD

⚠️ **IMPORTANTE:** Actualmente el sistema simula autenticación mediante query parameter `?usuarioId=X`. En producción DEBE implementarse:

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

---

## 📝 EJEMPLOS DE USO COMPLETO

### Flujo Típico: Estudiante Entrega una Tarea

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

### Flujo: Reenviar una Tarea

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

---

**Última actualización:** 2025-10-10
**Versión:** 1.0.0
**Estado:** ✅ Documentación completa
