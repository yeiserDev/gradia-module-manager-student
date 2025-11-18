# 📚 BACKEND ESTUDIANTE - REFERENCIA RÁPIDA

## 📌 Información del Proyecto
- **Proyecto:** GradIA - Module Manager Student
- **Versión:** 2.0.0
- **Puerto:** 3001
- **Base URL:** `http://localhost:3001`
- **Base de Datos:** PostgreSQL en Render.com (compartida con backend docente)
- **Total de Endpoints:** 10 funcionales
- **Autenticación:** ✅ JWT (HS256)
- **Control de Acceso:** ✅ Basado en Inscripciones + RBAC

---

## 🏗️ ARQUITECTURA

### Backend Docente vs Backend Estudiante

| Aspecto | Backend Docente | Backend Estudiante |
|---------|----------------|-------------------|
| **Puerto** | 3000 | 3001 |
| **Arquitectura** | Curso → Unidad → Actividad | Curso → Unidad → Actividad |
| **Base de Datos** | PostgreSQL (Render) | **Misma BD** (Render) |
| **Enfoque** | CRUD completo (gestión) | READ + Entregas (visualización) |
| **Cursos** | Crear, editar, eliminar | Solo visualizar |
| **Actividades** | Crear, editar, eliminar | Solo visualizar y entregar |
| **Entregas** | Ver todas (modo supervisor) | Solo ver y gestionar las propias |
| **Total endpoints** | 62 | 10 |

### Jerarquía de Datos
```
CURSO (Vista)
  └── UNIDAD (Vista)
       └── ACTIVIDAD (Vista - Conexión directa)
            └── ENTREGA (Gestión completa)
                 └── ARCHIVOS (Múltiples versiones)
```

---

## 📋 ENDPOINTS IMPLEMENTADOS (10)

### 1️⃣ VISUALIZACIÓN DE CURSOS (4 endpoints)

| Método | Endpoint | Descripción | Auth | Control de Acceso |
|--------|----------|-------------|------|-------------------|
| GET | `/api/student/cursos` | Ver todos mis cursos inscritos | ✅ JWT | Solo cursos inscritos |
| GET | `/api/student/cursos/:cursoId` | Detalle completo de un curso | ✅ JWT | Solo si está inscrito |
| GET | `/api/student/cursos/:cursoId/actividades` | Actividades de un curso con estado | ✅ JWT | Solo si está inscrito |
| GET | `/api/student/cursos/actividades/pendientes` | Dashboard de actividades urgentes | ✅ JWT | Todos los cursos inscritos |

**Características especiales:**
- ✅ Solo muestra cursos donde el estudiante está inscrito (tabla `inscripcion`)
- ✅ Solo muestra cursos activos
- ✅ Calcula `dias_restantes` en tiempo real
- ✅ Asigna `prioridad` automática (urgente, alta, media, normal)
- ✅ Muestra `estado_para_estudiante` (pendiente, vencida)
- ✅ Estadísticas agregadas por curso
- ✅ Validación automática de inscripción en `getDetalleCurso`

---

### 2️⃣ GESTIÓN DE ENTREGAS (6 endpoints)

| Método | Endpoint | Descripción | Auth | Control de Acceso |
|--------|----------|-------------|------|-------------------|
| GET | `/api/student/entregas/dashboard` | Estadísticas personales del estudiante | ✅ JWT | Solo propias entregas |
| GET | `/api/student/entregas` | Historial completo de mis entregas | ✅ JWT | Solo propias entregas |
| GET | `/api/student/entregas/:entregaId` | Detalle de una entrega específica | ✅ JWT | Solo si es dueño |
| POST | `/api/student/entregas` | Crear nueva entrega (enviar tarea) | ✅ JWT | Solo si inscrito en el curso |
| PUT | `/api/student/entregas/:entregaId` | Actualizar entrega (nuevo intento) | ✅ JWT | Solo si es dueño |
| DELETE | `/api/student/entregas/:entregaId` | Eliminar entrega (antes de fecha límite) | ✅ JWT | Solo si es dueño |

**Características especiales:**
- ✅ **Validación de inscripción** - Solo puede crear entregas en actividades de cursos donde está inscrito
- ✅ Validación de fecha límite
- ✅ Prevención de duplicados en actividades individuales
- ✅ Permite múltiples intentos (num_intento)
- ✅ Calcula `puntualidad` (a_tiempo, tardio)
- ✅ Información adicional: `puede_reenviar`, `dias_diferencia`
- ✅ Versionado de archivos por intento
- ✅ Usa `req.user.id` de JWT (no query params inseguros)

---

## 🔐 VALIDACIONES POR ENDPOINT

### POST /api/student/entregas
```
✅ JWT token válido requerido
✅ Rol ESTUDIANTE o ADMIN requerido
✅ id_actividad requerido
✅ El estudiante debe estar inscrito en el curso de la actividad
✅ La actividad debe existir
✅ La fecha límite no debe haber pasado
✅ No permitir duplicados en actividades individuales
✅ Crear ArchivoEntrega por cada archivo
✅ Usar usuarioId desde JWT (req.user.id)
```

### PUT /api/student/entregas/:entregaId
```
✅ La entrega debe existir
✅ Solo el dueño puede actualizarla (id_usuario)
✅ La fecha límite no debe haber pasado
✅ Incrementar num_intento automáticamente
✅ Actualizar fecha_entrega al momento actual
```

### DELETE /api/student/entregas/:entregaId
```
✅ La entrega debe existir
✅ Solo el dueño puede eliminarla (id_usuario)
✅ La fecha límite no debe haber pasado
✅ Eliminar ArchivoEntrega en cascada
```

---

## 📊 MODELOS SEQUELIZE IMPLEMENTADOS

### Modelos Activos (5)
```
Curso.js          ✅ READ-ONLY (vista)
Unidad.js         ✅ READ-ONLY (vista)
Actividad.js      ✅ READ-ONLY (vista)
Entrega.js        ✅ FULL CRUD (gestión)
ArchivoEntrega.js ✅ FULL CRUD (gestión)
```

### Relaciones (associations.js)
```javascript
Curso.hasMany(Unidad)
Unidad.belongsTo(Curso)

Unidad.hasMany(Actividad)
Actividad.belongsTo(Unidad)

Actividad.hasMany(Entrega)
Entrega.belongsTo(Actividad)

Entrega.hasMany(ArchivoEntrega)
ArchivoEntrega.belongsTo(Entrega)
```

---

## 🎯 SCHEMAS DE BASE DE DATOS

### Schemas Activos en Backend Estudiante

#### Schema: `cursos`
- ✅ `curso` - Información de cursos (READ-ONLY)
- ✅ `unidad` - Unidades de cada curso (READ-ONLY)

#### Schema: `actividades`
- ✅ `actividad` - Tareas/actividades (READ-ONLY, conectadas a `unidad` mediante `id_unidad`)
- ✅ `entrega` - Entregas de estudiantes (FULL CRUD)
- ✅ `archivo_entrega` - Archivos adjuntos (FULL CRUD)

#### Schema: `usuario`
- ✅ `usuario` - Información de usuarios (estudiantes y docentes)

### Schemas Disponibles para Próximas Fases

#### Schema: `evaluaciones`
- 📊 `rubrica` - Rúbricas de evaluación
- 📊 `criterio` - Criterios de evaluación
- 📊 `rubrica_criterio` - Relación rúbrica-criterio
- 📊 `nivel_criterio` - Niveles de desempeño
- 📊 `evaluacion` - Evaluaciones de entregas
- 📊 `evaluacion_documento` - Documentos de evaluación

#### Schema: `actividades` (pendientes)
- 💬 `comentario` - Comentarios sobre entregas
- 📁 `documento_actividad` - Materiales de apoyo

#### Schema: `grupos`
- 👥 `grupo` - Grupos para actividades grupales
- 👥 `miembro_grupo` - Miembros de cada grupo

#### Schema: `permisos`
- 🔐 `permiso` - Definición de permisos
- 🔐 `rol` - Roles de usuario
- 🔐 `rol_permiso` - Relación rol-permiso

#### Schema: `refresh_token`
- 🔑 `refresh_token` - Tokens de autenticación JWT

**⚠️ NOTA IMPORTANTE:**
- La tabla `sesion` fue **ELIMINADA** de la BD
- Las actividades ahora se conectan directamente con unidades mediante `id_unidad`
- Base de datos **compartida** con backend docente (PostgreSQL en Render)

---

## 🚀 PRÓXIMOS MÓDULOS (PLANIFICADOS)

### Prioridad Alta (Para 90% funcionalidad)
- 📊 **Evaluaciones** (4 endpoints) - Ver calificaciones
- 💬 **Comentarios** (2 endpoints) - Ver feedback docente
- 📁 **Materiales** (3 endpoints) - Acceder a recursos
- 👥 **Grupos** (5 endpoints) - Trabajo colaborativo

### Prioridad Media
- 🔔 **Notificaciones** (4 endpoints)
- 👤 **Perfil** (3 endpoints)
- 📅 **Calendario** (2 endpoints)

### Prioridad Baja
- 📝 **Inscripciones** (4 endpoints)
- 💬 **Foros** (5 endpoints)
- 📈 **Progreso** (3 endpoints)

---

## 🔧 CÓDIGOS HTTP

### Éxito
- **200** - GET, PUT, DELETE exitosos
- **201** - POST creación exitosa

### Error Cliente
- **400** - Validación fallida / Bad Request
- **403** - Sin permisos (Forbidden)
- **404** - Recurso no encontrado

### Error Servidor
- **500** - Error interno del servidor

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
src/
├── config/
│   └── database.js
├── models/
│   ├── associations.js        ⚠️ CRÍTICO: Define relaciones
│   ├── Curso.js
│   ├── Unidad.js
│   ├── Actividad.js           (id_unidad - conexión directa)
│   ├── Entrega.js
│   └── ArchivoEntrega.js
├── controllers/
│   ├── cursoEstudianteController.js
│   └── entregaEstudianteController.js
└── routes/
    ├── cursoEstudianteRoutes.js
    └── entregaEstudianteRoutes.js
```

---

## 🔐 SEGURIDAD

### ✅ Implementado:
- ✅ **Autenticación JWT (HS256)** - Todos los endpoints protegidos
- ✅ **Middleware de autorización** - `authorize(['ESTUDIANTE', 'ADMIN'])`
- ✅ **Validación de roles** - Solo estudiantes y admins pueden acceder
- ✅ **Validación de inscripciones** - Solo acceso a cursos/actividades inscritas
- ✅ **Helper functions** - verificarInscripcionEnCurso, verificarInscripcionEnActividad, obtenerCursoDeActividad
- ✅ **Usuario desde JWT** - Usa `req.user.id` en lugar de query params

### 🔒 Flujo de Seguridad:
1. **Login** → Backend de Autenticación genera JWT
2. **Cada Request** → Frontend envía JWT en header `Authorization: Bearer <token>`
3. **Middleware `authenticate`** → Valida JWT y extrae usuario (`req.user`)
4. **Middleware `authorize`** → Verifica rol del usuario (ESTUDIANTE o ADMIN)
5. **Helper `verificarInscripcionEnActividad`** → Valida acceso a la actividad/curso
6. **Controller** → Ejecuta lógica de negocio si todas las validaciones pasan

### ⚠️ Pendiente para Producción:
- [ ] Upload de archivos real (Multer)
- [ ] Rate limiting
- [ ] Validación de schemas con Joi/Yup

---

## 📝 DOCUMENTACIÓN RELACIONADA

- **[DOCUMENTACION_API.md](DOCUMENTACION_API.md)** - Guía práctica con ejemplos de uso completos
- **[CLAUDE.md](CLAUDE.md)** - Instrucciones para desarrollo y mantenimiento
- Este archivo - Referencia rápida de arquitectura

---

**Última actualización:** 2025-01-17
**Estado:** ✅ 100% funcional y seguro (módulos básicos)
**Versión:** 2.0.0
**Seguridad:** JWT (HS256) + RBAC + Control de Inscripciones
