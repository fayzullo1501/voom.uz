import multer from "multer";

export const uploadAvatar = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("only_images_allowed"));
    } else {
      cb(null, true);
    }
  },
});
