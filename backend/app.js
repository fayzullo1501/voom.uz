import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./config/env.js";

import authRoutes from "./routes/auth.routes.js";
import devRoutes from "./routes/dev.routes.js";
import adminRoutes from "./routes/admin.routes.js";


const app = express();

const allowedOrigins = [
  "https://www.voom.uz",
  "https://voom.uz",
  "https://admin.voom.uz",
  "http://localhost:5173",
  "http://localhost:5174", // admin local
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, origin);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

/**
 * AUTH (login, me)
 */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);


/**
 * DEV ONLY (create admin)
 */
app.use("/api/dev", devRoutes);

export default app;
