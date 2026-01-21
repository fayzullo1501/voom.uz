// ⬅️ ВАЖНО: dotenv должен быть загружен ПЕРВЫМ
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import env from "./config/env.js";
import connectDB from "./config/db.js";

const start = async () => {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(`🚀 API running on port ${env.port}`);
    });
  } catch (err) {
    console.error("❌ Server start error:", err);
    process.exit(1);
  }
};

start();
