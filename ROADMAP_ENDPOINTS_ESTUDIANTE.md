# 🚀 ROADMAP - ENDPOINTS BACKEND ESTUDIANTE

**Estado Actual:** 10 endpoints funcionales (70% completo)
**Objetivo:** 100% funcional con todos los módulos implementados

---

## ✅ ENDPOINTS ACTUALES (10)

### Módulo: Cursos (4 endpoints)
- ✅ GET `/api/student/cursos` - Ver todos mis cursos
- ✅ GET `/api/student/cursos/:cursoId` - Detalle de un curso
- ✅ GET `/api/student/cursos/:cursoId/actividades` - Actividades por curso
- ✅ GET `/api/student/cursos/actividades/pendientes` - Actividades pendientes

### Módulo: Entregas (6 endpoints)
- ✅ GET `/api/student/entregas/dashboard` - Dashboard personal
- ✅ GET `/api/student/entregas` - Mis entregas
- ✅ GET `/api/student/entregas/:entregaId` - Detalle de entrega
- ✅ POST `/api/student/entregas` - Crear entrega
- ✅ PUT `/api/student/entregas/:entregaId` - Actualizar entrega
- ✅ DELETE `/api/student/entregas/:entregaId` - Eliminar entrega ⚠️ **ARREGLADO**

---

## 🔧 MEJORAS URGENTES (Prioridad Alta)

### 1. ✅ DELETE Entrega - **ARREGLADO**
**Problema:** Error de foreign key al eliminar entregas con comentarios
**Solución:** Eliminar en cascada: comentarios → evaluaciones → archivos → entrega
**Estado:** ✅ Completado

---

## 📋 ENDPOINTS FALTANTES PARA 100%

### 🎯 PRIORIDAD ALTA (Funcionalidades Críticas)

#### Módulo: Evaluaciones (4 endpoints) - VISTA ESTUDIANTE
```
📁 MÓDULO: EVALUACIONES
├── GET /api/student/evaluaciones/:entregaId
│   └── Ver la evaluación de mi entrega
│   └── Incluye: puntuación, comentarios del docente, rúbrica aplicada
│
├── GET /api/student/evaluaciones/mis-calificaciones
│   └── Historial de todas mis calificaciones
│   └── Incluye: estadísticas, promedio, mejor/peor nota
│
├── GET /api/student/rubricas/:actividadId
│   └── Ver la rúbrica de una actividad (antes de entregar)
│   └── Incluye: criterios, niveles de desempeño, puntajes
│
└── GET /api/student/evaluaciones/estadisticas
    └── Estadísticas personales de evaluaciones
    └── Incluye: promedio general, tendencias, comparación con curso
```

#### Módulo: Comentarios (2 endpoints) - VISTA ESTUDIANTE
```
📁 MÓDULO: COMENTARIOS
├── GET /api/student/comentarios/:entregaId
│   └── Ver comentarios del docente en mi entrega
│   └── Incluye: contenido, fecha, docente que comentó
│
└── GET /api/student/comentarios/mis-comentarios
    └── Todos los comentarios recibidos
    └── Incluye: agrupados por actividad/curso
```

#### Módulo: Materiales (3 endpoints) - VISTA ESTUDIANTE
```
📁 MÓDULO: MATERIALES
├── GET /api/student/materiales/actividad/:actividadId
│   └── Ver materiales de apoyo de una actividad
│   └── Incluye: PDFs, videos, links, documentos
│
├── GET /api/student/materiales/curso/:cursoId
│   └── Todos los materiales de un curso
│   └── Incluye: agrupados por unidad/actividad
│
└── GET /api/student/materiales/recientes
    └── Materiales recientemente agregados
    └── Útil para dashboard
```

#### Módulo: Grupos (5 endpoints) - VISTA ESTUDIANTE
```
📁 MÓDULO: GRUPOS
├── GET /api/student/grupos/mis-grupos
│   └── Ver todos los grupos en los que estoy
│   └── Incluye: actividad, miembros, rol
│
├── GET /api/student/grupos/:grupoId
│   └── Detalle de un grupo específico
│   └── Incluye: miembros, entregas grupales, actividad
│
├── GET /api/student/grupos/actividad/:actividadId
│   └── Ver mi grupo para una actividad específica
│   └── Incluye: miembros, líder, estado
│
├── GET /api/student/grupos/:grupoId/entregas
│   └── Ver entregas del grupo
│   └── Incluye: quién entregó, archivos, evaluación
│
└── POST /api/student/grupos/:grupoId/entregas
    └── Crear entrega grupal (cualquier miembro puede)
    └── Valida: pertenencia al grupo, actividad grupal
```

---

### 🎨 PRIORIDAD MEDIA (Mejoras de UX)

#### Módulo: Notificaciones (4 endpoints)
```
📁 MÓDULO: NOTIFICACIONES
├── GET /api/student/notificaciones
│   └── Ver todas mis notificaciones
│   └── Tipos: nueva actividad, fecha límite próxima, calificación recibida
│
├── GET /api/student/notificaciones/no-leidas
│   └── Notificaciones pendientes de leer
│   └── Para badge de contador
│
├── PUT /api/student/notificaciones/:notifId/leer
│   └── Marcar notificación como leída
│
└── DELETE /api/student/notificaciones/:notifId
    └── Eliminar notificación
```

#### Módulo: Perfil Estudiante (3 endpoints)
```
📁 MÓDULO: PERFIL
├── GET /api/student/perfil
│   └── Ver mi información de perfil
│   └── Incluye: datos personales, foto, email
│
├── PUT /api/student/perfil
│   └── Actualizar mi perfil
│   └── Campos: nombre, email, foto, preferencias
│
└── GET /api/student/perfil/estadisticas-completas
    └── Estadísticas detalladas de mi desempeño
    └── Incluye: gráficos, tendencias, comparaciones
```

#### Módulo: Calendario (2 endpoints)
```
📁 MÓDULO: CALENDARIO
├── GET /api/student/calendario/mes/:mes
│   └── Ver actividades del mes
│   └── Formato calendario con fechas límite
│
└── GET /api/student/calendario/semana
    └── Actividades de esta semana
    └── Vista semanal
```

---

### 🌟 PRIORIDAD BAJA (Features Avanzadas)

#### Módulo: Inscripciones (4 endpoints)
```
📁 MÓDULO: INSCRIPCIONES
├── GET /api/student/inscripciones
│   └── Ver mis cursos inscritos
│
├── POST /api/student/inscripciones
│   └── Inscribirse a un curso
│
├── DELETE /api/student/inscripciones/:cursoId
│   └── Desinscribirse de un curso
│
└── GET /api/student/inscripciones/disponibles
    └── Ver cursos disponibles para inscribirse
```

#### Módulo: Foros/Discusiones (5 endpoints)
```
📁 MÓDULO: FOROS
├── GET /api/student/foros/curso/:cursoId
│   └── Ver foros de un curso
│
├── GET /api/student/foros/:foroId
│   └── Ver mensajes de un foro
│
├── POST /api/student/foros/:foroId/mensajes
│   └── Publicar mensaje en foro
│
├── PUT /api/student/foros/mensajes/:mensajeId
│   └── Editar mi mensaje
│
└── DELETE /api/student/foros/mensajes/:mensajeId
    └── Eliminar mi mensaje
```

#### Módulo: Progreso (3 endpoints)
```
📁 MÓDULO: PROGRESO
├── GET /api/student/progreso/curso/:cursoId
│   └── Ver mi progreso en un curso
│   └── % de actividades completadas
│
├── GET /api/student/progreso/general
│   └── Progreso general en todos los cursos
│   └── Dashboard con gráficos
│
└── GET /api/student/progreso/certificados
    └── Certificados obtenidos (cursos completados)
```

---

## 📊 RESUMEN CUANTITATIVO

### Estado Actual
- **Implementados:** 10 endpoints ✅
- **Funcionalidad:** 70% (básico funcional)

### Prioridad Alta (Para llegar al 90%)
- **Evaluaciones:** 4 endpoints
- **Comentarios:** 2 endpoints
- **Materiales:** 3 endpoints
- **Grupos:** 5 endpoints
- **Subtotal:** 14 endpoints adicionales

### Prioridad Media (Para llegar al 95%)
- **Notificaciones:** 4 endpoints
- **Perfil:** 3 endpoints
- **Calendario:** 2 endpoints
- **Subtotal:** 9 endpoints adicionales

### Prioridad Baja (Para llegar al 100%)
- **Inscripciones:** 4 endpoints
- **Foros:** 5 endpoints
- **Progreso:** 3 endpoints
- **Subtotal:** 12 endpoints adicionales

### **Total Proyectado:** 45 endpoints completos

---

## 🎯 PLAN DE IMPLEMENTACIÓN SUGERIDO

### Fase 1: MVP Completo (Prioridad Alta) - 2-3 semanas
**Objetivo:** Backend estudiante 90% funcional

1. **Semana 1:** Módulo Evaluaciones + Comentarios
   - Ver calificaciones de mis entregas
   - Ver comentarios del docente
   - Ver rúbricas de actividades

2. **Semana 2:** Módulo Materiales + Grupos (parte 1)
   - Acceder a materiales de apoyo
   - Ver mis grupos
   - Detalle de grupos

3. **Semana 3:** Módulo Grupos (parte 2)
   - Entregas grupales
   - Testing completo de Fase 1

**Resultado:** Backend estudiante completamente funcional para uso diario

---

### Fase 2: Mejoras de UX (Prioridad Media) - 2 semanas
**Objetivo:** Backend estudiante 95% funcional

4. **Semana 4:** Notificaciones + Perfil
   - Sistema de notificaciones
   - Gestión de perfil personal

5. **Semana 5:** Calendario
   - Vista calendario de actividades
   - Testing completo de Fase 2

**Resultado:** Experiencia de usuario mejorada significativamente

---

### Fase 3: Features Avanzadas (Prioridad Baja) - 3 semanas
**Objetivo:** Backend estudiante 100% completo

6. **Semana 6-7:** Inscripciones + Progreso
   - Sistema de inscripción a cursos
   - Tracking de progreso detallado

7. **Semana 8:** Foros/Discusiones
   - Sistema de comunicación entre estudiantes
   - Testing completo de Fase 3

**Resultado:** Backend estudiante con todas las features

---

## 🔧 CONSIDERACIONES TÉCNICAS

### Modelos Nuevos Requeridos:
1. `Comentario.js` - ✅ Ya existe en BD
2. `Evaluacion.js` - ✅ Ya existe en BD
3. `DetalleEvaluacion.js` - ✅ Ya existe en BD
4. `Rubrica.js` - ✅ Ya existe en BD
5. `Criterio.js` - ✅ Ya existe en BD
6. `MaterialActividad.js` - ✅ Ya existe en BD (documento_actividad)
7. `Grupo.js` - ✅ Ya existe en BD
8. `MiembroGrupo.js` - ✅ Ya existe en BD
9. `Notificacion.js` - ❌ Crear (opcional)
10. `Inscripcion.js` - ❌ Crear (opcional)
11. `ForoMensaje.js` - ❌ Crear (opcional)

**Ventaja:** La mayoría de tablas ya existen en la BD compartida con backend docente.

---

## 📁 ESTRUCTURA DE CARPETAS SUGERIDA

```
src/
├── controllers/
│   ├── cursoEstudianteController.js ✅
│   ├── entregaEstudianteController.js ✅
│   ├── evaluacionEstudianteController.js ❌ CREAR
│   ├── comentarioEstudianteController.js ❌ CREAR
│   ├── materialEstudianteController.js ❌ CREAR
│   ├── grupoEstudianteController.js ❌ CREAR
│   ├── notificacionEstudianteController.js ❌ CREAR (opcional)
│   ├── perfilEstudianteController.js ❌ CREAR (opcional)
│   └── calendarioEstudianteController.js ❌ CREAR (opcional)
│
├── routes/
│   ├── cursoEstudianteRoutes.js ✅
│   ├── entregaEstudianteRoutes.js ✅
│   ├── evaluacionEstudianteRoutes.js ❌ CREAR
│   ├── comentarioEstudianteRoutes.js ❌ CREAR
│   ├── materialEstudianteRoutes.js ❌ CREAR
│   ├── grupoEstudianteRoutes.js ❌ CREAR
│   ├── notificacionEstudianteRoutes.js ❌ CREAR (opcional)
│   ├── perfilEstudianteRoutes.js ❌ CREAR (opcional)
│   └── calendarioEstudianteRoutes.js ❌ CREAR (opcional)
│
└── models/
    ├── Curso.js ✅
    ├── Unidad.js ✅
    ├── Actividad.js ✅
    ├── Entrega.js ✅
    ├── ArchivoEntrega.js ✅
    ├── Comentario.js ❌ CREAR
    ├── Evaluacion.js ❌ CREAR
    ├── DetalleEvaluacion.js ❌ CREAR
    ├── Rubrica.js ❌ CREAR
    ├── Criterio.js ❌ CREAR
    ├── MaterialActividad.js ❌ CREAR
    ├── Grupo.js ❌ CREAR
    └── MiembroGrupo.js ❌ CREAR
```

---

## 🎯 RECOMENDACIÓN FINAL

### Para un backend estudiante 100% funcional, implementar en este orden:

1. **Ahora Mismo (Urgente):**
   - ✅ Arreglar DELETE entrega (COMPLETADO)

2. **Próximos Pasos Inmediatos (Prioridad Alta):**
   - Módulo Evaluaciones (ver calificaciones)
   - Módulo Comentarios (ver feedback docente)
   - Módulo Materiales (acceder a recursos)
   - Módulo Grupos (trabajo colaborativo)

3. **Después (Prioridad Media):**
   - Notificaciones
   - Perfil de estudiante
   - Calendario

4. **Opcional (Prioridad Baja):**
   - Inscripciones
   - Foros
   - Progreso avanzado

---

**Estado Actual:** 10/45 endpoints (22%)
**Con Fase 1:** 24/45 endpoints (53%)
**Con Fase 2:** 33/45 endpoints (73%)
**Con Fase 3:** 45/45 endpoints (100%)

---

**Última actualización:** 2025-10-10
**Próxima revisión:** Después de implementar Fase 1
