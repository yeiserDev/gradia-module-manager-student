  # 📚 GradIA - Backend Student (Vista de Estudiante)

  Backend para la gestión de cursos, entregas y actividades desde la perspectiva del estudiante.

  ---

  ## 🚀 Inicio Rápido

  ### Prerequisitos

  - Node.js v16+ instalado
  - PostgreSQL (o acceso a la BD en Render)
  - Git

  ### Instalación

  ```bash
  # 1. Clonar el repositorio
  git clone <URL_DEL_REPOSITORIO>
  cd gradia-module-manager-student

  # 2. Instalar dependencias
  npm install

  # 3. Configurar variables de entorno (ver sección siguiente)
  cp .env.example .env
  # Editar .env con tus credenciales

  # 4. Iniciar el servidor
  npm start
  ```

  El servidor estará disponible en: `http://localhost:3001`

  ---

  ## ⚙️ Configuración de Variables de Entorno

  Crea un archivo `.env` en la raíz del proyecto:

  ### 🏠 Configuración LOCAL (Desarrollo)

  Usa esta configuración cuando estés desarrollando en tu computadora:

  ```env
  # Puerto del servidor
  PORT=3001

  # JWT Secret (DEBE SER EL MISMO que en auth_gradia)
  JWT_SECRET=elgradia2025$

  # URL del servicio de autenticación (LOCAL)
  AUTH_SERVICE_URL=http://localhost:8080

  # URL del frontend (LOCAL)
  FRONTEND_URL=http://localhost:3000

  # Base de datos PostgreSQL
  DB_HOST=dpg-d4f53ibili9vc739cgsng-a.oregon-postgres.render.com
  DB_PORT=5432
  DB_NAME=gradia_database_2025
  DB_USER=gradia_user
  DB_PASSWORD=V8uMNQchR7snMlgBXj2YF165e3CKefY6

  # Ambiente
  NODE_ENV=development
  ```

  ### ☁️ Configuración PRODUCCIÓN (Render/Deploy)

  Usa esta configuración cuando despliegues en Render u otro servicio:

  ```env
  # Puerto (Render lo asigna automáticamente)
  PORT=3001

  # JWT Secret (DEBE SER EL MISMO que en auth_gradia)
  JWT_SECRET=elgradia2025$

  # URL del servicio de autenticación (PRODUCCIÓN)
  AUTH_SERVICE_URL=https://auth-gradia.onrender.com

  # URL del frontend (PRODUCCIÓN)
  FRONTEND_URL=https://gradia-frontend.vercel.app

  # Base de datos PostgreSQL (misma BD compartida)
  DB_HOST=dpg-d4f53ibili9vc739cgsng-a.oregon-postgres.render.com
  DB_PORT=5432
  DB_NAME=gradia_database_2025
  DB_USER=gradia_user
  DB_PASSWORD=V8uMNQchR7snMlgBXj2YF165e3CKefY6

  # Ambiente
  NODE_ENV=production
  ```

  ---

  ## 🔑 Autenticación JWT

  Este backend **requiere autenticación JWT** en todas las rutas.

  ### Cómo funciona:

  1. El usuario hace login en `auth_gradia` (puerto 8080)
  2. Recibe un `accessToken` JWT
  3. El frontend incluye el token en cada request:
    ```
    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    ```
  4. Este backend valida el token y verifica que el usuario tenga rol `ESTUDIANTE` o `ADMIN`

  ### ⚠️ IMPORTANTE:

  El `JWT_SECRET` debe ser **exactamente el mismo** en:
  - `auth_gradia/.env`
  - `gradia-module-manager-teacher/.env`
  - `gradia-module-manager-student/.env`

  Si no coinciden, los tokens no se podrán validar.

  ---

  ## 📡 Endpoints Disponibles

  Todos los endpoints requieren:
  - Header: `Authorization: Bearer <token>`
  - Rol: `ESTUDIANTE` o `ADMIN`

  ### Cursos

  ```
  GET    /api/student/cursos              - Obtener mis cursos inscritos
  GET    /api/student/cursos/pendientes   - Obtener actividades pendientes
  GET    /api/student/cursos/:id          - Obtener detalle de un curso
  GET    /api/student/cursos/:id/actividades - Actividades de un curso
  ```

  ### Entregas

  ```
  GET    /api/student/entregas/dashboard  - Dashboard personal del estudiante
  GET    /api/student/entregas            - Todas mis entregas
  GET    /api/student/entregas/:id        - Detalle de una entrega
  POST   /api/student/entregas            - Crear nueva entrega
  PUT    /api/student/entregas/:id        - Actualizar entrega
  DELETE /api/student/entregas/:id        - Eliminar entrega
  ```

  ### Comentarios

  ```
  POST   /api/student/comentarios         - Crear comentario
  GET    /api/student/comentarios/:id     - Obtener comentario
  ```

  ### Materiales

  ```
  GET    /api/student/materiales          - Obtener materiales del curso
  GET    /api/student/materiales/:id      - Detalle de un material
  POST   /api/student/materiales/:id/descargar - Registrar descarga
  ```

  ### Grupos

  ```
  GET    /api/student/grupos              - Mis grupos
  GET    /api/student/grupos/:id          - Detalle de un grupo
  GET    /api/student/grupos/:id/miembros - Miembros de un grupo
  ```

  ---

  ## 🧪 Pruebas con Postman

  ### 1. Login (en auth_gradia)

  ```
  POST http://localhost:8080/api/auth/login

  Body (JSON):
  {
    "email": "estudiante@test.com",
    "password": "123456"
  }

  Response:
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

  ### 2. Obtener mis cursos

  ```
  GET http://localhost:3001/api/student/cursos

  Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

  Response:
  {
    "success": true,
    "data": [
      {
        "id_curso": 1,
        "nombre_curso": "Matemáticas I",
        "descripcion": "...",
        "unidades": [...]
      }
    ]
  }
  ```

  ---

  ## 🏗️ Estructura del Proyecto

  ```
  gradia-module-manager-student/
  ├── src/
  │   ├── controllers/          # Lógica de negocio
  │   │   ├── cursoEstudianteController.js
  │   │   ├── entregaEstudianteController.js
  │   │   ├── comentarioEstudianteController.js
  │   │   ├── materialEstudianteController.js
  │   │   └── grupoEstudianteController.js
  │   ├── routes/               # Definición de rutas
  │   │   ├── cursoEstudianteRoutes.js
  │   │   ├── entregaEstudianteRoutes.js
  │   │   ├── comentarioEstudianteRoutes.js
  │   │   ├── materialEstudianteRoutes.js
  │   │   └── grupoEstudianteRoutes.js
  │   ├── middlewares/          # Middlewares de autenticación
  │   │   ├── authenticate.js   # ✅ Valida JWT
  │   │   └── authorize.js      # ✅ Verifica roles
  │   └── models/               # Modelos Sequelize
  ├── app.js                    # Configuración principal
  ├── package.json
  ├── .env                      # Variables de entorno (NO SUBIR A GIT)
  ├── .env.example              # Ejemplo de .env
  └── README.md
  ```

  ---

  ## 🔧 Comandos Disponibles

  ```bash
  # Iniciar servidor en desarrollo
  npm start

  # Iniciar con nodemon (recarga automática)
  npm run dev

  # Verificar sintaxis
  npm run lint
  ```

  ---

  ## 🌐 Desplegar en Render

  ### Paso 1: Crear nuevo Web Service

  1. Ve a [Render.com](https://render.com)
  2. Click en **"New +"** → **"Web Service"**
  3. Conecta tu repositorio de GitHub

  ### Paso 2: Configuración

  ```
  Name: gradia-student-backend
  Environment: Node
  Build Command: npm install
  Start Command: npm start
  ```

  ### Paso 3: Variables de Entorno

  Agrega las siguientes variables en Render:

  ```
  PORT=3001
  JWT_SECRET=elgradia2025$
  AUTH_SERVICE_URL=https://auth-gradia.onrender.com
  FRONTEND_URL=https://gradia-frontend.vercel.app
  DB_HOST=dpg-d4f53ibili9vc739cgsng-a.oregon-postgres.render.com
  DB_PORT=5432
  DB_NAME=gradia_database_2025
  DB_USER=gradia_user
  DB_PASSWORD=V8uMNQchR7snMlgBXj2YF165e3CKefY6
  NODE_ENV=production
  ```

  ### Paso 4: Deploy

  Click en **"Create Web Service"** y espera a que se despliegue.

  Tu backend estará disponible en: `https://gradia-student-backend.onrender.com`

  ---

  ## 🔒 Seguridad

  ### Roles Permitidos

  Este backend **solo** permite acceso a usuarios con rol:
  - `ESTUDIANTE`
  - `ADMIN`

  Si un usuario con rol `DOCENTE` intenta acceder, recibirá:

  ```json
  {
    "success": false,
    "message": "Acceso denegado. Se requiere uno de los siguientes roles: ESTUDIANTE, ADMIN"
  }
  ```

  ### Headers Requeridos

  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```

  ---

  ## ❓ Problemas Comunes

  ### Error: "NO AUTH TOKEN"

  **Solución:** Asegúrate de incluir el header `Authorization: Bearer <token>`

  ### Error: "INVALID OR EXPIRED TOKEN"

  **Soluciones:**
  1. Verifica que `JWT_SECRET` sea igual en todos los backends
  2. Haz login de nuevo para obtener un token fresco (expiran en 15 min)

  ### Error: "Acceso denegado"

  **Solución:** Tu usuario debe tener rol `ESTUDIANTE` o `ADMIN`. Verifica con:
  ```
  GET http://localhost:8080/api/auth/me
  ```

  ### Error de CORS

  **Solución:** Verifica que `FRONTEND_URL` en `.env` coincida con la URL de tu frontend

  ---

  ## 📚 Recursos

  - [Documentación de Auth Backend](../auth_gradia/README.md)
  - [Documentación de Teacher Backend](../gradia-module-manager-teacher/README.md)
  - [Guía de Integración JWT](../INTEGRACION_AUTH.md)

  ---

  ## 👥 Equipo

  - **Desarrollado por:** Equipo GradIA
  - **Versión:** 1.0.0
  - **Última actualización:** 2025-11-15

  ---

  ## 📝 Notas Importantes

  1. **JWT_SECRET:** Debe ser el mismo en los 3 backends
  2. **Base de Datos:** Todos los backends comparten la misma BD PostgreSQL
  3. **Roles:** Este backend SOLO acepta usuarios con rol `ESTUDIANTE` o `ADMIN`
  4. **Tokens:** Expiran en 15 minutos, usa el refresh token para renovarlos
  5. **CORS:** El frontend debe estar en `FRONTEND_URL` para evitar errores

  ---

  ## 🆘 Soporte

  Si tienes problemas:
  1. Revisa esta documentación
  2. Verifica las variables de entorno
  3. Consulta los logs del servidor
  4. Revisa la [Guía de Integración](../INTEGRACION_AUTH.md)
