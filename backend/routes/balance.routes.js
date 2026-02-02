import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import { getBalance, getTransactions } from "../controllers/balance.controller.js";

const router = Router();

router.get("/", auth, getBalance);
router.get("/transactions", auth, getTransactions);

export default router;
