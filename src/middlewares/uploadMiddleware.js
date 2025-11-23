// src/middlewares/uploadMiddleware.js
const multer = require("multer");

// Almacenamiento en memoria → necesario para subir a S3
const storage = multer.memoryStorage();

// Filtro opcional (por ahora NO bloqueamos ningún archivo)
const fileFilter = (req, file, cb) => {
  // Estudiante puede subir videos y documentos
  cb(null, true);
};

// Configuración principal de Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024, // Máximo 200 MB (puedes cambiarlo)
  }
});

// Exportar variantes comunes
module.exports = {
  uploadSingle: upload.single("archivo"),
  uploadArray: upload.array("archivos"),
  upload, // por si necesitas algo especial
};
