import express from "express";
import { getNotifications, markNotificationRead } from "../controllers/notification.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", auth, getNotifications);
router.patch("/:id/read", auth, markNotificationRead);

export default router;