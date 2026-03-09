import { Router } from "express";
import multer from "multer";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  approveProfilePhoto,
  rejectProfilePhoto,
  approvePassport,
  rejectPassport,
  getAdminStats,
  getAdminRoutes,
  deleteRoutes
} from "../controllers/admin.controller.js";
import auth from "../middlewares/auth.middleware.js";
import brandsRoutes from "./brands.routes.js";
import carModelsRoutes from "./carModels.routes.js";
import carColorsRoutes from "./carColors.routes.js";
import {
  createNews,
  getAdminNews,
  deleteNews,
  publishNews,
  uploadNewsImage,
  getAdminNewsById
} from "../controllers/news.controller.js";
import {
  createAd,
  getAdminAds,
  deleteAds,
  publishAds,
  uploadAdImage,
  getAdminAdById
} from "../controllers/ads.controller.js";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.get("/users", auth, getUsers);
router.post("/users", auth, createUser);
router.put("/users/:id", auth, updateUser);
router.delete("/users/:id", auth, deleteUser);
router.get("/users/:id", auth, getUserById);
router.post("/users/:id/photo/approve", auth, approveProfilePhoto);
router.post("/users/:id/photo/reject", auth, rejectProfilePhoto);
router.post("/users/:id/passport/approve", auth, approvePassport);
router.post("/users/:id/passport/reject", auth, rejectPassport);
router.use("/brands", brandsRoutes);
router.use("/models", carModelsRoutes);
router.use("/colors", carColorsRoutes);
router.get("/stats", auth, getAdminStats);
router.get("/routes", auth, getAdminRoutes);
router.delete("/routes", auth, deleteRoutes);
router.post("/news", auth, createNews);
router.get("/news", auth, getAdminNews);
router.delete("/news", auth, deleteNews);
router.patch("/news/publish", auth, publishNews);
router.post("/news/upload", auth, upload.single("image"), uploadNewsImage);
router.get("/news/:id", auth, getAdminNewsById);
router.post("/ads", auth, createAd);
router.get("/ads", auth, getAdminAds);
router.delete("/ads", auth, deleteAds);
router.patch("/ads/publish", auth, publishAds);
router.post("/ads/upload", auth, upload.single("image"), uploadAdImage);
router.get("/ads/:id", auth, getAdminAdById);

export default router;
