import mongoose from "mongoose";
import User from "../models/User.js";
import env from "../config/env.js";
import { hashPassword } from "../utils/password.js";

const run = async () => {
  try {
    await mongoose.connect(env.mongoUri);

    // ===== ДАННЫЕ АДМИНА =====
    const firstName = "FAYZULLO";
    const lastName = "ABDULAZIZOV";
    const phone = "999961696"; // 9 цифр, без +998
    const password = "Fa123!@#";

    const existingUser = await User.findOne({ phone });

    // ===== ЕСЛИ ПОЛЬЗОВАТЕЛЬ УЖЕ ЕСТЬ =====
    if (existingUser) {
      existingUser.role = "admin";
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.phoneVerified = true;

      // если хотим обновить пароль
      existingUser.passwordHash = await hashPassword(password);

      await existingUser.save();

      console.log("✅ Existing user promoted to admin:");
      console.log({
        id: existingUser._id.toString(),
        phone: existingUser.phone,
        role: existingUser.role,
      });

      process.exit(0);
    }

    // ===== ЕСЛИ ПОЛЬЗОВАТЕЛЯ НЕТ — СОЗДАЁМ =====
    const passwordHash = await hashPassword(password);

    const admin = await User.create({
      firstName,
      lastName,
      phone,
      passwordHash,
      role: "admin",
      phoneVerified: true,
    });

    console.log("✅ New admin created:");
    console.log({
      id: admin._id.toString(),
      phone: admin.phone,
      role: admin.role,
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
};

run();
