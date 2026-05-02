const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadRoot = path.join(__dirname, '..', 'uploads', 'products');
fs.mkdirSync(uploadRoot, { recursive: true });

// Memory storage for base64 conversion
const storage = multer.memoryStorage();

const uploadProductImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(new Error('Only JPG, PNG, and WEBP files are allowed'));
      return;
    }

    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// Middleware to convert file buffer to base64
const convertToBase64 = (req, res, next) => {
  if (req.file) {
    req.file.base64 = req.file.buffer.toString('base64');
    req.file.mimeType = req.file.mimetype;
    // Remove buffer to save memory
    delete req.file.buffer;
  }
  next();
};

module.exports = {
  uploadProductImage,
  convertToBase64
};
