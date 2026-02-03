// routes/brands.routes.js
import { Router } from "express";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrands,
} from "../controllers/brands.controller.js";
import auth from "../middlewares/auth.middleware.js";
import { uploadBrandLogo } from "../controllers/brands.controller.js";
import { uploadAvatar } from "../middlewares/uploadAvatar.middleware.js";


const router = Router();

router.get("/", auth, getBrands);
router.post("/", auth, createBrand);
router.put("/:id", auth, updateBrand);
router.delete("/", auth, deleteBrands);
router.post("/:id/logo", auth, uploadAvatar.single("logo"), uploadBrandLogo);

export default router;
