import { Router } from "express";
import {
  getCities,
  getCityById,
  createCity,
  updateCity,
  deleteCities,
  importCitiesFromSource,
} from "../controllers/city.controller.js";
import auth from "../middlewares/auth.middleware.js";
import adminOnly from "../middlewares/admin.middleware.js";

const router = Router();

router.get("/", getCities);
router.get("/:id", getCityById);

router.post("/", auth, adminOnly, createCity);
router.put("/:id", auth, adminOnly, updateCity);
router.delete("/", auth, adminOnly, deleteCities);
router.post("/import", auth, adminOnly, importCitiesFromSource);

export default router;
