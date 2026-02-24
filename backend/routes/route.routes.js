// routes/route.routes.js
import express from "express";
import {
  createRoute,
  getMyRoutes,
  getMyRouteById,
  updateRouteStatus,
  searchRoutes,
  getRouteByIdPublic
} from "../controllers/route.controller.js";
import auth from "../middlewares/auth.middleware.js";
import { getRouteSharePage } from "../controllers/share.controller.js";

const router = express.Router();

// PUBLIC
router.get("/search", searchRoutes);
router.get("/public/:id", getRouteByIdPublic);
router.get("/:lang/:id/share", getRouteSharePage);

// PRIVATE
router.post("/", auth, createRoute);
router.get("/", auth, getMyRoutes);
router.get("/:id", auth, getMyRouteById);
router.patch("/:id/status", auth, updateRouteStatus);

export default router;