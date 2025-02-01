const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadDir = 'uploads/';

// Ensure the directory exists; if not, create it
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Set the upload directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using current timestamp and file extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File validation to only accept JPEG, JPG, and PNG files
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const isValid = allowedTypes.test(file.mimetype) && allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (isValid) {
      cb(null, true);  // Accept the file
    } else {
      cb(new Error('Only JPEG, JPG, and PNG files are allowed.'));  // Reject invalid files
    }
  },
});

module.exports = upload;