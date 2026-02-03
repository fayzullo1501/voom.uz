import dotenv from "dotenv";

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 7001),

  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",

  // ===== CLIENT =====
  CLIENT_URL: process.env.CLIENT_URL,

  // ===== CLICK =====
  CLICK_BASE_URL: process.env.CLICK_BASE_URL,
  CLICK_SERVICE_ID: process.env.CLICK_SERVICE_ID,
  CLICK_MERCHANT_ID: process.env.CLICK_MERCHANT_ID,
  CLICK_MERCHANT_USER_ID: process.env.CLICK_MERCHANT_USER_ID,
  CLICK_SECRET_KEY: process.env.CLICK_SECRET_KEY,
  CLICK_CALLBACK_URL: process.env.CLICK_CALLBACK_URL,
};

export default env;
