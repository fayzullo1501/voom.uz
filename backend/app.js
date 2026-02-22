import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./config/env.js";

import authRoutes from "./routes/auth.routes.js";
import devRoutes from "./routes/dev.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import balanceRoutes from "./routes/balance.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import carsRoutes from "./routes/cars.routes.js";
import userCarsRoutes from "./routes/userCars.routes.js";
import cityRoutes from "./routes/city.routes.js";
import routeRoutes from "./routes/route.routes.js";
import bookingRoutes from "./routes/booking.routes.js";




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
app.use(express.urlencoded({ extended: true }));
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
 * BALANCE
 */
app.use("/api/balance", balanceRoutes);
/**
 * PAYMENTS
 */
app.use("/api/payment", paymentRoutes);
/**
 * CARS (справочник транспортов)
 */
app.use("/api/cars", carsRoutes);
app.use("/api/profile/cars", userCarsRoutes);
/**
 * DRIVER ROUTES (создание маршрутов)
 */
app.use("/api/profile/routes", routeRoutes);
app.use("/api/routes", routeRoutes);
/**
 * BOOKINGS
 */
app.use("/api/bookings", bookingRoutes);
/**
 * CITIES (справочник городов)
 */
app.use("/api/cities", cityRoutes);






/**
 * DEV ONLY (create admin)
 */
app.use("/api/dev", devRoutes);

export default app;
