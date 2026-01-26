import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  approveProfilePhoto,
  rejectProfilePhoto,
} from "../controllers/admin.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/users", auth, getUsers);
router.post("/users", auth, createUser);
router.put("/users/:id", auth, updateUser);
router.delete("/users/:id", auth, deleteUser);
router.get("/users/:id", auth, getUserById);
router.post("/users/:id/photo/approve", auth, approveProfilePhoto);
router.post("/users/:id/photo/reject", auth, rejectProfilePhoto);


export default router;
