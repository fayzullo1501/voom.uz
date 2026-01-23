import { Router } from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/admin.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/users", auth, getUsers);
router.post("/users", auth, createUser);
router.put("/users/:id", auth, updateUser);
router.delete("/users/:id", auth, deleteUser);

export default router;
