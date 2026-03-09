import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";

import {
  getNews,
  getNewsById
} from "../controllers/news.controller.js";

const router = Router();

/* PUBLIC */

router.get("/news", getNews);
router.get("/news/:id", getNewsById);

export default router;