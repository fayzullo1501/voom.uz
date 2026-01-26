import multer from "multer";

export const uploadPassport = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (_, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowed.includes(file.mimetype)) {
      cb(new Error("invalid_file_type"));
    } else {
      cb(null, true);
    }
  },
});
