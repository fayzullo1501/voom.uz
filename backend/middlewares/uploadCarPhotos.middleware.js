// middlewares/uploadCarPhotos.middleware.js
import multer from "multer";

const storage = multer.memoryStorage();

const uploadCarPhotos = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per photo
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

export default uploadCarPhotos;
