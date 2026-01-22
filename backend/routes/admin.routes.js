import { Router } from "express";
import { getUsers } from "../controllers/admin.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * ADMIN: GET USERS
 */
router.get("/users", auth, getUsers);


export default router;
