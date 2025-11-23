const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 },
});

// NO exportar upload.single() aquí.
// SÍ exportar funciones wrap.
module.exports = {
  upload,
  single: (name = "archivo") => upload.single(name),
  array: (name = "archivos", max = 10) => upload.array(name, max),
};
