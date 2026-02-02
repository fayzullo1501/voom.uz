import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import { initClickPayment, clickCallback } from "../controllers/payment.controller.js";

const router = Router();

router.post("/click/init", auth, initClickPayment);
router.post("/callback/click", clickCallback);

export default router;
