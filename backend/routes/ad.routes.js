import { Router } from "express";

import {
  getAds,
  getAdById
} from "../controllers/ads.controller.js";

const router = Router();

/* PUBLIC */

router.get("/ads", getAds);
router.get("/ads/:id", getAdById);

export default router;