const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    // Define how the uploaded file should be named
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB in bytes
  fileFilter: function (req, file, cb) {
    const allowedMimeTypes = [
      'text/plain',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only text files are allowed!'),false);
    }
  },
});

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      console.error("File limit error",err);
      return res.status(400).json({ error: 'File size exceeds 1MB limit.' });
    }
    return res.status(400).json({ error: 'Multer error: ' + err.message });
  } else if (err) {
    console.error("file type invalid",err);
    return res.status(400).json({ error: err.message });
  } else {
    next();
  }
};

module.exports = {
  upload,
  handleMulterError
}