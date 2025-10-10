# 🧪 GUÍA PARA PROBAR EVALUACIONES

## ❗ IMPORTANTE

Para que un **estudiante pueda ver evaluaciones**, primero un **docente debe crear evaluaciones** en el backend docente.

---

## 📋 FLUJO COMPLETO

### PASO 1: Backend DOCENTE - Crear Evaluación

**Backend Docente URL:** `http://localhost:3000`

#### 1.1 Verificar que hay entregas
```bash
GET http://localhost:3000/api/entregas
```

Anota el `id_entrega` de alguna entrega (ejemplo: `id_entrega: 2`)

#### 1.2 Crear una Evaluación (Docente)
```bash
POST http://localhost:3000/api/evaluaciones
Content-Type: application/json

{
  "id_entrega": 2,
  "id_usuario": 1,
  "puntuacion_total": 85.50,
  "comentarios": "Excelente trabajo, sigue así!",
  "detalles": [
    {
      "id_criterio": 1,
      "id_nivel_criterio": 1,
      "puntuacion": 30.0,
      "comentario": "Código muy limpio"
    },
    {
      "id_criterio": 2,
      "id_nivel_criterio": 5,
      "puntuacion": 25.5,
      "comentario": "Buena documentación"
    },
    {
      "id_criterio": 3,
      "id_nivel_criterio": 9,
      "puntuacion": 30.0,
      "comentario": "Tests completos"
    }
  ]
}
```

**Response esperado:**
```json
{
  "success": true,
  "data": {
    "id_evaluacion": 1,
    "id_entrega": 2,
    "puntuacion_total": 85.50,
    "comentarios": "Excelente trabajo, sigue así!",
    ...
  },
  "message": "Evaluación creada exitosamente"
}
```

---

### PASO 2: Backend ESTUDIANTE - Ver Evaluación

**Backend Estudiante URL:** `http://localhost:3001`

#### 2.1 Ver evaluación de mi entrega
```bash
GET http://localhost:3001/api/student/evaluaciones/2?usuarioId=1
```

**Response esperado:**
```json
{
  "success": true,
  "data": {
    "id_evaluacion": 1,
    "id_entrega": 2,
    "puntuacion_total": 85.50,
    "comentarios": "Excelente trabajo, sigue así!",
    "fecha_evaluacion": "2025-10-10T...",
    "entrega": {
      "id_entrega": 2,
      "actividad": {
        "nombre_actividad": "Tarea 1",
        "unidad": {
          "titulo_unidad": "Unidad 1",
          "curso": {
            "nombre_curso": "Programación Avanzada"
          }
        }
      }
    },
    "detalles": [
      {
        "puntuacion": 30.0,
        "comentario": "Código muy limpio",
        "criterio": {
          "nombre_criterio": "Calidad del código",
          "peso": 30.0
        },
        "nivel": {
          "nombre_nivel": "Excelente",
          "puntuacion": 30.0
        }
      }
    ],
    "info_adicional": {
      "puntuacion_maxima": 100,
      "porcentaje": 85.5,
      "total_criterios": 3
    }
  },
  "message": "Evaluación obtenida exitosamente"
}
```

#### 2.2 Ver mi historial de calificaciones
```bash
GET http://localhost:3001/api/student/evaluaciones/mis-calificaciones?usuarioId=1
```

#### 2.3 Ver estadísticas
```bash
GET http://localhost:3001/api/student/evaluaciones/estadisticas?usuarioId=1
```

---

## 🚨 PROBLEMAS COMUNES

### Problema 1: "Esta entrega aún no ha sido evaluada"
**Causa:** No hay evaluación creada para esa entrega
**Solución:** El docente debe crear una evaluación primero (PASO 1.2)

### Problema 2: "Entrega no encontrada"
**Causa:** El `id_entrega` no existe o no pertenece a tu usuario
**Solución:** Verifica que el `id_entrega` existe y pertenece al `usuarioId` correcto

### Problema 3: "No tienes calificaciones registradas"
**Causa:** No hay ninguna evaluación en la BD para tus entregas
**Solución:** El docente debe evaluar al menos una de tus entregas

---

## 🔍 PREREQUISITOS EN LA BASE DE DATOS

Para que funcione correctamente, necesitas:

### 1. Rúbrica creada (Backend Docente)
```bash
POST http://localhost:3000/api/rubricas
{
  "nombre_rubrica": "Rúbrica de Programación",
  "descripcion": "Para evaluar código",
  "puntuacion_maxima": 100,
  "id_usuario": 1
}
```

### 2. Criterios creados (Backend Docente)
```bash
POST http://localhost:3000/api/criterios
{
  "nombre_criterio": "Calidad del código",
  "descripcion": "Código limpio y eficiente",
  "peso": 30.0,
  "id_usuario": 1
}
```

### 3. Vincular Rúbrica con Criterios (Backend Docente)
```bash
POST http://localhost:3000/api/rubricas/1/criterios
{
  "id_criterio": 1,
  "orden": 1
}
```

### 4. Niveles de criterio (Backend Docente)
```bash
POST http://localhost:3000/api/criterios/1/niveles
{
  "nombre_nivel": "Excelente",
  "descripcion": "Código ejemplar",
  "puntuacion": 30.0
}
```

### 5. Asignar Rúbrica a Actividad (Backend Docente)
```bash
PUT http://localhost:3000/api/actividades/1
{
  "id_rubrica": 1
}
```

---

## 🎯 FLUJO RÁPIDO DE PRUEBA (Sin Rúbricas)

Si no quieres crear rúbricas, puedes crear evaluaciones simples:

### Backend Docente - Evaluación Simple
```bash
POST http://localhost:3000/api/evaluaciones
{
  "id_entrega": 2,
  "id_usuario": 1,
  "puntuacion_total": 85.50,
  "comentarios": "Buen trabajo"
}
```

### Backend Estudiante - Ver Evaluación
```bash
GET http://localhost:3001/api/student/evaluaciones/2?usuarioId=1
```

Esto debería funcionar incluso sin criterios detallados.

---

## 📊 VERIFICAR DATOS EN LA BD

### Verificar si hay evaluaciones:
```sql
SELECT * FROM evaluaciones.evaluacion;
```

### Verificar entregas de un estudiante:
```sql
SELECT * FROM actividades.entrega WHERE id_usuario = 1;
```

### Verificar evaluaciones de un estudiante:
```sql
SELECT e.*
FROM evaluaciones.evaluacion e
INNER JOIN actividades.entrega ent ON e.id_entrega = ent.id_entrega
WHERE ent.id_usuario = 1;
```

---

## ✅ CHECKLIST RÁPIDO

Antes de probar el endpoint del estudiante:

- [ ] Backend DOCENTE corriendo en puerto 3000
- [ ] Backend ESTUDIANTE corriendo en puerto 3001
- [ ] Existe al menos 1 entrega en la BD
- [ ] El docente creó al menos 1 evaluación
- [ ] La evaluación está asociada a una entrega del estudiante
- [ ] El `usuarioId` coincide con el dueño de la entrega

---

## 🚀 PRUEBA COMPLETA PASO A PASO

```bash
# 1. Backend Docente - Crear entrega (si no existe)
POST http://localhost:3000/api/entregas
{
  "id_actividad": 1,
  "id_usuario": 1
}
# Respuesta: id_entrega = 2

# 2. Backend Docente - Evaluar la entrega
POST http://localhost:3000/api/evaluaciones
{
  "id_entrega": 2,
  "id_usuario": 1,
  "puntuacion_total": 90,
  "comentarios": "Muy buen trabajo!"
}
# Respuesta: id_evaluacion = 1

# 3. Backend Estudiante - Ver mi evaluación
GET http://localhost:3001/api/student/evaluaciones/2?usuarioId=1
# Respuesta: Debe mostrar la evaluación con puntuación 90

# 4. Backend Estudiante - Ver mi historial
GET http://localhost:3001/api/student/evaluaciones/mis-calificaciones?usuarioId=1
# Respuesta: Debe mostrar 1 evaluación en el historial

# 5. Backend Estudiante - Ver estadísticas
GET http://localhost:3001/api/student/evaluaciones/estadisticas?usuarioId=1
# Respuesta: Promedio general = 90
```

---

**Última actualización:** 2025-10-10
**Backends necesarios:** Docente (3000) + Estudiante (3001)
**Estado:** ✅ Guía completa lista
