// routes/carColors.routes.js
import { Router } from "express";
import {
  getColors,
  createColor,
  updateColor,
  deleteColors,
} from "../controllers/carColors.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", auth, getColors);
router.post("/", auth, createColor);
router.put("/:id", auth, updateColor);
router.delete("/", auth, deleteColors);

export default router;
