import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./config/env.js";

import authRoutes from "./routes/auth.routes.js";
import devRoutes from "./routes/dev.routes.js";

const app = express();

const allowedOrigins = [
  "https://voom.uz",
  "https://admin.voom.uz",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, origin);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

/**
 * AUTH (login, me)
 */
app.use("/api/auth", authRoutes);

/**
 * DEV ONLY (create admin)
 */
app.use("/api/dev", devRoutes);

export default app;
