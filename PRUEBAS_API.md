# 🧪 GUÍA RÁPIDA DE PRUEBAS - API GradIA Student
**Última actualización:** 2025-10-12 (Corregidos endpoints de materiales)

## 🚀 Iniciar el Servidor

```bash
node app.js
```

Deberías ver:
```
✅ ESTUDIANTE - Conexión a la base de datos establecida correctamente.
🎓 VISTA ESTUDIANTE - Servidor corriendo en puerto 3001
📚 Health check: http://localhost:3001/api/health
🌐 Base URL: http://localhost:3001
```

---

## ✅ Verificar Estado del Servidor

```bash
curl http://localhost:3001/api/health
```

**Respuesta esperada:**
```json
{
  "status": "OK",
  "database": "Connected",
  "message": "Vista Estudiante - Conexión exitosa",
  "timestamp": "2025-10-12T..."
}
```

---

## 📋 PRUEBAS POR MÓDULO

### 1️⃣ VISUALIZACIÓN DE CURSOS (4 endpoints)

#### Ver todos mis cursos
```bash
curl http://localhost:3001/api/student/cursos
```

#### Ver detalle de un curso
```bash
curl http://localhost:3001/api/student/cursos/1
```

#### Ver actividades de un curso
```bash
curl http://localhost:3001/api/student/cursos/1/actividades
```

#### Ver actividades pendientes
```bash
curl "http://localhost:3001/api/student/cursos/actividades/pendientes?usuarioId=1"
```

---

### 2️⃣ GESTIÓN DE ENTREGAS (6 endpoints)

#### Ver dashboard personal
```bash
curl "http://localhost:3001/api/student/entregas/dashboard?usuarioId=1"
```

#### Ver todas mis entregas
```bash
curl "http://localhost:3001/api/student/entregas?usuarioId=1"
```

#### Ver detalle de una entrega
```bash
curl "http://localhost:3001/api/student/entregas/1?usuarioId=1"
```

#### Crear nueva entrega
```bash
curl -X POST http://localhost:3001/api/student/entregas \
  -H "Content-Type: application/json" \
  -d "{\"id_actividad\": 5, \"id_usuario\": 1, \"archivos\": [{\"nombre\": \"tarea.pdf\", \"tipo\": \"pdf\", \"url\": \"/uploads/tarea.pdf\"}]}"
```

#### Actualizar entrega (reenvío)
```bash
curl -X PUT http://localhost:3001/api/student/entregas/1 \
  -H "Content-Type: application/json" \
  -d "{\"archivos\": [{\"nombre\": \"tarea_v2.pdf\", \"tipo\": \"pdf\", \"url\": \"/uploads/tarea_v2.pdf\"}]}"
```

#### Eliminar entrega
```bash
curl -X DELETE "http://localhost:3001/api/student/entregas/1?usuarioId=1"
```

---

### 3️⃣ VISUALIZACIÓN DE COMENTARIOS (2 endpoints)

#### Ver todos mis comentarios
```bash
curl "http://localhost:3001/api/student/comentarios?usuarioId=1"
```

#### Ver comentarios de una entrega
```bash
curl "http://localhost:3001/api/student/comentarios/entrega/1?usuarioId=1"
```

---

### 4️⃣ GESTIÓN DE MATERIALES (3 endpoints)

#### Ver materiales de una actividad
```bash
curl http://localhost:3001/api/student/materiales/actividad/5
```

#### Ver detalle de un material
```bash
curl http://localhost:3001/api/student/materiales/6
```

#### Ver todos los materiales de un curso
```bash
curl http://localhost:3001/api/student/materiales/curso/1
```

---

### 5️⃣ GESTIÓN DE GRUPOS (3 endpoints)

#### Ver todos mis grupos
```bash
curl "http://localhost:3001/api/student/grupos?usuarioId=1"
```

#### Ver detalle de un grupo
```bash
curl "http://localhost:3001/api/student/grupos/1?usuarioId=1"
```

#### Ver grupos de una actividad
```bash
curl http://localhost:3001/api/student/grupos/actividad/5
```

---

## 🔥 PRUEBA RÁPIDA DE TODOS LOS ENDPOINTS

Copia y pega este script para probar todos los endpoints en secuencia:

```bash
#!/bin/bash

echo "=== 🧪 PRUEBAS API GradIA Student ==="
echo ""

echo "1. Health Check..."
curl -s http://localhost:3001/api/health | jq .
echo ""

echo "2. Ver cursos..."
curl -s http://localhost:3001/api/student/cursos | jq .
echo ""

echo "3. Ver actividades pendientes..."
curl -s "http://localhost:3001/api/student/cursos/actividades/pendientes?usuarioId=1" | jq .
echo ""

echo "4. Ver dashboard..."
curl -s "http://localhost:3001/api/student/entregas/dashboard?usuarioId=1" | jq .
echo ""

echo "5. Ver mis entregas..."
curl -s "http://localhost:3001/api/student/entregas?usuarioId=1" | jq .
echo ""

echo "6. Ver mis comentarios..."
curl -s "http://localhost:3001/api/student/comentarios?usuarioId=1" | jq .
echo ""

echo "7. Ver materiales de actividad..."
curl -s http://localhost:3001/api/student/materiales/actividad/5 | jq .
echo ""

echo "8. Ver mis grupos..."
curl -s "http://localhost:3001/api/student/grupos?usuarioId=1" | jq .
echo ""

echo "✅ Pruebas completadas!"
```

**Para Windows (PowerShell):**
```powershell
Write-Host "=== 🧪 PRUEBAS API GradIA Student ===" -ForegroundColor Green

Write-Host "`n1. Health Check..."
Invoke-RestMethod -Uri "http://localhost:3001/api/health"

Write-Host "`n2. Ver cursos..."
Invoke-RestMethod -Uri "http://localhost:3001/api/student/cursos"

Write-Host "`n3. Ver actividades pendientes..."
Invoke-RestMethod -Uri "http://localhost:3001/api/student/cursos/actividades/pendientes?usuarioId=1"

Write-Host "`n4. Ver dashboard..."
Invoke-RestMethod -Uri "http://localhost:3001/api/student/entregas/dashboard?usuarioId=1"

Write-Host "`n5. Ver mis grupos..."
Invoke-RestMethod -Uri "http://localhost:3001/api/student/grupos?usuarioId=1"

Write-Host "`n✅ Pruebas completadas!" -ForegroundColor Green
```

---

## 📊 RESULTADOS ESPERADOS

### ✅ Respuesta Exitosa
```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

### ❌ Respuesta con Error
```json
{
  "success": false,
  "message": "Descripción del error"
}
```

---

## 🔍 VALIDACIONES COMUNES

### Errores 400 (Bad Request)
- Campo obligatorio faltante
- Fecha límite ya pasada
- Ya existe una entrega para esta actividad
- No se puede eliminar después de fecha límite

### Errores 403 (Forbidden)
- No tienes permisos para acceder a este recurso
- No eres miembro de este grupo

### Errores 404 (Not Found)
- Recurso no encontrado
- Curso/Actividad/Entrega no existe

### Errores 500 (Internal Server Error)
- Error en la base de datos
- Error interno del servidor

---

## 💡 TIPS PARA PRUEBAS

1. **Usa `jq` para formatear JSON**: Instala jq y agrega `| jq .` al final de tus curl
2. **Guarda el ID de recursos creados**: Anota los IDs que te devuelve la API para usarlos en otras pruebas
3. **Prueba casos de error**: Intenta acceder a recursos que no existen o sin permisos
4. **Verifica fechas límite**: Algunas operaciones dependen de si la fecha límite ya pasó
5. **Monitorea la consola del servidor**: Los logs te ayudarán a entender qué está pasando

---

## 🛠️ HERRAMIENTAS RECOMENDADAS

- **curl**: Cliente HTTP de línea de comandos
- **Postman**: GUI para probar APIs
- **Insomnia**: Alternativa a Postman
- **Thunder Client**: Extensión de VS Code
- **jq**: Procesador JSON para terminal

---

**Versión**: 1.0.0
**Última actualización**: 2025-10-12
**Total de endpoints probados**: 18 ✅
