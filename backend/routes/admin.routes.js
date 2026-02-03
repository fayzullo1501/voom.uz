import { Router } from "express";
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
} from "../controllers/admin.controller.js";
import auth from "../middlewares/auth.middleware.js";
import brandsRoutes from "./brands.routes.js";
import carModelsRoutes from "./carModels.routes.js";
import carColorsRoutes from "./carColors.routes.js";

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


export default router;
