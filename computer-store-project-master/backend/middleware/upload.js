const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadRoot = path.join(__dirname, '..', 'uploads', 'products');
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadRoot),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .slice(0, 50);
    cb(null, `${Date.now()}-${baseName}${ext}`);
  }
});

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

module.exports = {
  uploadProductImage
};
