import { Router } from "express";
import User from "../models/User.js";
import { hashPassword } from "../utils/password.js";

const router = Router();

/**
 * DEV ONLY
 * Создание первого администратора
 * Работает ТОЛЬКО вне production
 */
router.post("/create-admin", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ message: "forbidden" });
  }

  const rawPhone = req.body.phone;
  const password = req.body.password;

  const phone = String(rawPhone || "").replace(/\D/g, "").slice(-9);

  if (!phone || phone.length !== 9 || !password) {
    return res.status(400).json({
      message: "phone (9 digits) and password required",
    });
  }

  const exists = await User.findOne({ phone });
  if (exists) {
    return res.status(409).json({ message: "admin already exists" });
  }

  const passwordHash = await hashPassword(password);

  const admin = await User.create({
    phone,
    passwordHash,
    role: "admin",
    isVerified: true,
    fullName: "VOOM Admin",
  });

  res.status(201).json({
    id: admin._id,
    phone: admin.phone,
    role: admin.role,
    createdAt: admin.createdAt,
  });
});

export default router;
