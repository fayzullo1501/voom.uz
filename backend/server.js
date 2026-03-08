// ⬅️ ВАЖНО: dotenv должен быть загружен ПЕРВЫМ
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import env from "./config/env.js";
import connectDB from "./config/db.js";
import http from "http";
import { Server } from "socket.io";

const start = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: [
          "https://voom.uz",
          "https://www.voom.uz",
          "http://localhost:5173"
        ],
        credentials: true
      }
    });

    app.set("io", io);

    io.on("connection", (socket) => {

      socket.on("join", (userId) => {
        socket.join(userId);
      });

    });

    server.listen(env.port, () => {
      console.log(`🚀 API running on port ${env.port}`);
    });
  } catch (err) {
    console.error("❌ Server start error:", err);
    process.exit(1);
  }
};

start();
