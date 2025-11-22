# 📚 ENDPOINTS BACKEND ESTUDIANTE - ACTUALIZADO 2025

## 🎯 Información General

| Información | Detalle |
|-------------|---------|
| **Estado** | ✅ 100% Funcional con Seguridad JWT |
| **Total de Endpoints** | **24 endpoints operativos** |
| **Base de Datos** | PostgreSQL en Render.com (gradia_database_2025 - compartida) |
| **Stack** | Node.js + Express.js + Sequelize |
| **Puerto** | 3001 |
| **Base URL** | `http://localhost:3001/api/student` |
| **Autenticación** | ✅ JWT (HS256) - Header: `Authorization: Bearer <token>` |
| **Control de Acceso** | ✅ Rol ESTUDIANTE/ADMIN requerido + Inscripciones |
| **Última Actualización** | 2025-01-21 |

---

## 📊 RESUMEN DE ENDPOINTS POR MÓDULO

| # | Módulo | Endpoints | URL Base | Auth |
|---|--------|-----------|----------|------|
| 1 | [Cursos](#1️⃣-cursos) | 4 | `/api/student/cursos` | ✅ JWT + ESTUDIANTE |
| 2 | [Entregas](#2️⃣-entregas) | 6 | `/api/student/entregas` | ✅ JWT + ESTUDIANTE |
| 3 | [Evaluaciones](#3️⃣-evaluaciones) | 4 | `/api/student/evaluaciones` | ✅ JWT + ESTUDIANTE |
| 4 | [Grupos](#4️⃣-grupos) | 3 | `/api/student/grupos` | ✅ JWT + ESTUDIANTE |
| 5 | [Comentarios](#5️⃣-comentarios) | 2 | `/api/student/comentarios` | ✅ JWT + ESTUDIANTE |
| 6 | [Materiales](#6️⃣-materiales) | 3 | `/api/student/materiales` | ✅ JWT + ESTUDIANTE |
| 7 | [Actividades](#7️⃣-actividades) | 0 | - | ❌ Archivo vacío |
| 8 | [Utilidad](#8️⃣-utilidad) | 2 | `/api/health`, `/` | ✅ Público |

**TOTAL: 24 endpoints operativos**

---

## 1️⃣ CURSOS

**Total: 4 endpoints (Vista de solo lectura)**

| Método | Endpoint | Descripción | Control de Acceso |
|--------|----------|-------------|-------------------|
| `GET` | `/api/student/cursos` | Ver todos mis cursos inscritos | ✅ Solo cursos inscritos |
| `GET` | `/api/student/cursos/actividades/pendientes` | Dashboard de actividades pendientes/urgentes | ✅ Todos los cursos inscritos |
| `GET` | `/api/student/cursos/:cursoId` | Detalle completo de un curso específico | ✅ Solo si está inscrito |
| `GET` | `/api/student/cursos/:cursoId/actividades` | Todas las actividades de un curso con estado | ✅ Solo si está inscrito |

**Archivo:** `src/routes/cursoEstudianteRoutes.js`

**Características especiales:**
- ✅ Solo muestra cursos donde el estudiante está inscrito (tabla `cursos.inscripcion`)
- ✅ Calcula `dias_restantes` en tiempo real
- ✅ Asigna `prioridad` automática (urgente, alta, media, normal)
- ✅ Muestra `estado_para_estudiante` (pendiente, vencida)
- ✅ Estadísticas agregadas por curso

---

## 2️⃣ ENTREGAS

**Total: 6 endpoints (Gestión completa de entregas propias)**

| Método | Endpoint | Descripción | Control de Acceso |
|--------|----------|-------------|-------------------|
| `GET` | `/api/student/entregas/dashboard` | Estadísticas personales del estudiante | ✅ Solo propias entregas |
| `GET` | `/api/student/entregas` | Historial completo de mis entregas | ✅ Solo propias entregas |
| `GET` | `/api/student/entregas/:entregaId` | Detalle de una entrega específica | ✅ Solo si es dueño |
| `POST` | `/api/student/entregas` | Crear nueva entrega (enviar tarea) | ✅ Solo si inscrito en el curso |
| `PUT` | `/api/student/entregas/:entregaId` | Actualizar entrega (nuevo intento) | ✅ Solo si es dueño |
| `DELETE` | `/api/student/entregas/:entregaId` | Eliminar entrega (antes de fecha límite) | ✅ Solo si es dueño |

**Archivo:** `src/routes/entregaEstudianteRoutes.js`

**Características especiales:**
- ✅ **Validación de inscripción** - Solo puede crear entregas en actividades de cursos donde está inscrito
- ✅ Validación de fecha límite
- ✅ Prevención de duplicados en actividades individuales
- ✅ Permite múltiples intentos (`num_intento`)
- ✅ Calcula `puntualidad` (a_tiempo, tardio)
- ✅ Información adicional: `puede_reenviar`, `dias_diferencia`
- ✅ Versionado de archivos por intento
- ✅ Usa `req.user.id` de JWT (seguro)

---

## 3️⃣ EVALUACIONES

**Total: 4 endpoints (Vista de calificaciones)**

| Método | Endpoint | Descripción | Control de Acceso |
|--------|----------|-------------|-------------------|
| `GET` | `/api/student/evaluaciones/estadisticas` | Estadísticas de mis evaluaciones | ✅ Solo propias |
| `GET` | `/api/student/evaluaciones/mis-calificaciones` | Historial completo de calificaciones | ✅ Solo propias |
| `GET` | `/api/student/evaluaciones/rubrica/:actividadId` | Ver rúbrica de una actividad | ✅ Si inscrito en curso |
| `GET` | `/api/student/evaluaciones/:entregaId` | Ver evaluación de una entrega específica | ✅ Solo si es dueño de la entrega |

**Archivo:** `src/routes/evaluacionEstudianteRoutes.js`

**Características especiales:**
- ✅ Ver evaluaciones detalladas con rúbrica y criterios
- ✅ Estadísticas de desempeño académico
- ✅ Historial completo de calificaciones por curso/actividad
- ✅ Solo acceso a evaluaciones propias

---

## 4️⃣ GRUPOS

**Total: 3 endpoints (Vista de solo lectura)**

| Método | Endpoint | Descripción | Control de Acceso |
|--------|----------|-------------|-------------------|
| `GET` | `/api/student/grupos` | Obtener todos mis grupos | ✅ Solo grupos propios |
| `GET` | `/api/student/grupos/actividad/:actividadId` | Grupos de una actividad específica | ✅ Si inscrito en curso |
| `GET` | `/api/student/grupos/:grupoId` | Detalle de un grupo específico | ✅ Si es miembro |

**Archivo:** `src/routes/grupoEstudianteRoutes.js`

**Características especiales:**
- ✅ Ver grupos donde es miembro
- ✅ Ver compañeros de grupo
- ✅ Solo lectura (los docentes gestionan los grupos)

---

## 5️⃣ COMENTARIOS

**Total: 2 endpoints (Vista de solo lectura)**

| Método | Endpoint | Descripción | Control de Acceso |
|--------|----------|-------------|-------------------|
| `GET` | `/api/student/comentarios` | Todos mis comentarios | ✅ Solo comentarios propios |
| `GET` | `/api/student/comentarios/entrega/:entregaId` | Comentarios de una entrega específica | ✅ Solo si es dueño de la entrega |

**Archivo:** `src/routes/comentarioEstudianteRoutes.js`

**Características especiales:**
- ✅ Ver feedback del docente
- ✅ Solo lectura (no puede comentar)

---

## 6️⃣ MATERIALES

**Total: 3 endpoints (Vista de solo lectura)**

| Método | Endpoint | Descripción | Control de Acceso |
|--------|----------|-------------|-------------------|
| `GET` | `/api/student/materiales/actividad/:actividadId` | Materiales de una actividad específica | ✅ Si inscrito en curso |
| `GET` | `/api/student/materiales/curso/:cursoId` | Todos los materiales de un curso | ✅ Si inscrito |
| `GET` | `/api/student/materiales/:materialId` | Detalle de un material específico | ✅ Si inscrito en curso |

**Archivo:** `src/routes/materialEstudianteRoutes.js`

**Características especiales:**
- ✅ Ver documentos de apoyo (PDF, videos, PPT, links)
- ✅ Solo lectura (los docentes suben materiales)

---

## 7️⃣ ACTIVIDADES

**Total: 0 endpoints**

❌ **Archivo vacío:** `actividadEstudianteRoutes.js` solo tiene 1 línea (no implementado)

Las actividades se ven a través del endpoint `/api/student/cursos/:cursoId/actividades`

---

## 8️⃣ UTILIDAD

**Total: 2 endpoints**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Información general de la API |
| `GET` | `/api/health` | Verificar estado del servidor y BD |

**Archivo:** `app.js`

---

## 🏗️ ARQUITECTURA BACKEND ESTUDIANTE

### Vista del Estudiante:

```
📚 VER CURSOS INSCRITOS
   └── 📖 VER UNIDADES
        └── 📝 VER ACTIVIDADES
             ├── 📎 VER MATERIALES (documentos)
             ├── 📊 VER RÚBRICAS
             ├── 👥 VER GRUPOS (si pertenece)
             │
             └── 📤 GESTIONAR MIS ENTREGAS
                  ├── ✅ Crear/Actualizar/Eliminar
                  ├── 📁 Subir archivos
                  ├── 💬 VER COMENTARIOS (feedback docente)
                  └── ⭐ VER EVALUACIONES (calificaciones)
```

### Comparación con Backend Docente:

| Aspecto | Backend Docente | Backend Estudiante |
|---------|----------------|-------------------|
| **Cursos** | Ver inscritos (2) | Ver inscritos (4) |
| **Unidades** | CRUD completo (6) | ❌ No tiene acceso directo |
| **Actividades** | CRUD completo (6) | Ver a través de cursos |
| **Entregas** | Supervisar todas (8) | Gestionar propias (6) |
| **Evaluaciones** | Crear y gestionar (7) | Ver propias (4) |
| **Grupos** | CRUD completo (8) | Ver propios (3) |
| **Comentarios** | Crear feedback (5) | Ver recibidos (2) |
| **Materiales** | CRUD completo (6) | Ver (3) |
| **Rúbricas** | CRUD completo (6) | ❌ No tiene |
| **Criterios** | CRUD completo (6) | ❌ No tiene |

---

## 🔐 SEGURIDAD Y AUTENTICACIÓN

### ✅ Flujo de Autenticación:

1. **Login** → Backend de Autenticación (`http://localhost:8080/api/auth/login`)
2. **Token JWT** → Frontend guarda en `localStorage` como `gradia_access_token`
3. **Cada Request** → Header: `Authorization: Bearer <token>`
4. **Middleware `authenticate`** → Extrae `req.user.id` y `req.user.email`
5. **Middleware `authorize`** → Valida rol `ESTUDIANTE` o `ADMIN`
6. **Controller** → Ejecuta lógica con filtros por usuario

### 🔒 Características de Seguridad:

- ✅ **JWT HS256** con secret: `elgradia2025$`
- ✅ **Validación de rol** (solo ESTUDIANTE/ADMIN)
- ✅ **Validación de inscripción** antes de acceder a recursos
- ✅ **Filtrado automático** por `req.user.id` (no usa query params)
- ✅ **Control de propiedad** (solo accede a sus propias entregas/evaluaciones)

---

## 📊 VALIDACIONES POR ENDPOINT

### POST `/api/student/entregas`
```
✅ JWT token válido
✅ Rol ESTUDIANTE o ADMIN
✅ id_actividad requerido
✅ El estudiante debe estar inscrito en el curso
✅ La actividad debe existir
✅ La fecha límite no debe haber pasado (warning si tardío)
✅ No duplicados en actividades individuales
✅ Crear ArchivoEntrega por cada archivo
✅ Usar req.user.id (no body.id_usuario)
```

### GET `/api/student/cursos/:cursoId`
```
✅ JWT token válido
✅ Rol ESTUDIANTE o ADMIN
✅ El estudiante debe estar inscrito en el curso
✅ Solo mostrar cursos activos
```

### GET `/api/student/evaluaciones/:entregaId`
```
✅ JWT token válido
✅ Rol ESTUDIANTE o ADMIN
✅ La entrega debe pertenecer al estudiante autenticado
✅ Solo mostrar evaluación si existe
```

---

## 📈 ESTADÍSTICAS DEL PROYECTO

| Métrica | Cantidad |
|---------|----------|
| **Endpoints Totales** | 24 |
| **Endpoints Operativos** | 24 |
| **Archivos de Rutas** | 7 (1 vacío) |
| **Controllers** | 6 |
| **Modelos (Compartidos)** | 16 |

### Distribución por Tipo:

| Tipo | Cantidad | % |
|------|----------|---|
| **GET (Lectura)** | 20 | 83% |
| **POST (Crear)** | 1 | 4% |
| **PUT (Actualizar)** | 1 | 4% |
| **DELETE (Eliminar)** | 1 | 4% |
| **Utilidad** | 2 | 8% |

---

## 🎯 FUNCIONALIDADES PRINCIPALES

### ✅ Implementado:

1. **Dashboard Personalizado**
   - Ver cursos inscritos
   - Actividades pendientes/urgentes
   - Estadísticas de entregas
   - Estadísticas de evaluaciones

2. **Gestión de Entregas**
   - Crear entrega (enviar tarea)
   - Actualizar entrega (nuevo intento)
   - Eliminar entrega (antes de fecha límite)
   - Ver historial completo

3. **Seguimiento Académico**
   - Ver calificaciones con rúbricas
   - Historial de evaluaciones
   - Estadísticas de desempeño
   - Feedback del docente (comentarios)

4. **Recursos Educativos**
   - Ver materiales de actividades
   - Ver grupos de trabajo
   - Ver rúbricas de evaluación

### ⏳ No Implementado (Vista de solo lectura):

- ❌ No puede crear/editar cursos
- ❌ No puede crear/editar unidades
- ❌ No puede crear/editar actividades
- ❌ No puede crear/editar grupos
- ❌ No puede comentar (solo ver)
- ❌ No puede subir materiales

---

## 📝 REGLAS DE NEGOCIO

1. **Inscripciones:**
   - Solo accede a cursos donde está inscrito
   - Validación automática en cada request

2. **Entregas:**
   - Permite múltiples intentos
   - Se puede eliminar solo antes de fecha límite
   - No puede eliminar si ya fue evaluada
   - Actividades individuales: 1 entrega por estudiante
   - Actividades grupales: 1 entrega por grupo

3. **Evaluaciones:**
   - Solo lectura
   - Solo ve sus propias calificaciones
   - No puede editar ni eliminar

4. **Grupos:**
   - Solo lectura
   - Ve grupos donde es miembro
   - Los docentes gestionan la membresía

---

## 🔗 DOCUMENTACIÓN RELACIONADA

| Documento | Ubicación |
|-----------|-----------|
| **Backend Teacher** | `gradia-module-manager-teacher/ENDPOINTS_ACTUALIZADOS_2025.md` |
| **Backend Auth** | `auth_gradia/README.md` |
| **Resumen General** | `RESUMEN_APIS_OPERATIVAS_2025.md` |

---

**Última actualización:** 2025-01-21 07:00 AM
**Versión:** 2.0
**Stack:** Node.js v20+ + Express.js v4.21 + Sequelize v6.37 + PostgreSQL
