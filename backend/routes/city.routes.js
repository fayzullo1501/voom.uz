import { Router } from "express";
import cityController from "../controllers/city.controller.js";
import auth from "../middlewares/auth.middleware.js";
import adminOnly from "../middlewares/admin.middleware.js";


const router = Router();

// 🔹 Публичный список городов + поиск + пагинация
router.get("/", cityController.getCities);
router.get("/:id", cityController.getCityById);

// 🔹 Только admin
router.post("/", auth, adminOnly, cityController.createCity);
router.put("/:id", auth, adminOnly, cityController.updateCity);
router.delete("/", auth, adminOnly, cityController.deleteCities);
router.post("/import", auth, adminOnly, cityController.importCitiesFromSource);

export default router;
