// routes/userCars.routes.js
import express from "express";
import {
  createUserCar,
  getMyCars,
  getMyCarById,
  updateMyCar,
  uploadCarPhoto,
  deleteCarPhoto,
  deleteMyCar,
} from "../controllers/userCars.controller.js";
import auth from "../middlewares/auth.middleware.js";
import uploadCarPhotos from "../middlewares/uploadCarPhotos.middleware.js";

const router = express.Router();

router.post("/", auth, createUserCar);
router.get("/", auth, getMyCars);
router.get("/:id", auth, getMyCarById);
router.patch("/:id", auth, updateMyCar);

router.post("/:id/photos", auth, uploadCarPhotos.single("photo"), uploadCarPhoto);
router.delete("/:id/photos/:photoId", auth, deleteCarPhoto);
router.delete("/:id", auth, deleteMyCar);

export default router;

