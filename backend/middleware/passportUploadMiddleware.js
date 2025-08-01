const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📁 Папка для паспортов
const passportDir = path.join(__dirname, '../uploads/passports');
if (!fs.existsSync(passportDir)) {
  fs.mkdirSync(passportDir, { recursive: true });
}

// 🗂️ Хранилище
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, passportDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// ✅ Разрешённые типы файлов
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Разрешены только PDF, DOCX, JPG, PNG'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
