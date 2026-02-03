// routes/carModels.routes.js
import { Router } from "express";
import {
  getModels,
  createModel,
  updateModel,
  deleteModels,
} from "../controllers/carModels.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", auth, getModels);
router.post("/", auth, createModel);
router.put("/:id", auth, updateModel);
router.delete("/", auth, deleteModels);

export default router;
