const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📁 Путь к папке uploads
const uploadDir = path.join(__dirname, '../uploads');

// ✅ Создаём папку, если не существует
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🗂️ Настройка хранилища
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg'; // подстраховка на случай отсутствия расширения
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// 🔒 Фильтр — разрешаем только изображения
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Разрешены только изображения (jpg, png, webp)'), false);
  }
};

// 📦 Экспорт
const upload = multer({ storage, fileFilter });

module.exports = upload;
