import { Router } from "express";
import { getActiveBrands, getActiveModels, getActiveColors } from "../controllers/cars.controller.js";

const router = Router();

router.get("/brands", getActiveBrands);
router.get("/models", getActiveModels);
router.get("/colors", getActiveColors);

export default router;
