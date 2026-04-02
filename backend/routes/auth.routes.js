import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import auth from "../middlewares/auth.middleware.js";

// Лимит на отправку SMS — не более 5 раз в 15 минут с одного IP
const smsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Слишком много запросов. Попробуйте через 15 минут." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Лимит на логин — не более 10 попыток в 15 минут
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Слишком много попыток входа. Попробуйте через 15 минут." },
  standardHeaders: true,
  legacyHeaders: false,
});
import {
  checkUser,
  sendCode,
  verifyCode,
  verifyProfilePhone,
  verifyProfileEmail,
  sendEmailCode,
  verifyEmailCode,
  setPassword,
  login,
  adminLogin,
  me,
  updateProfile,
  uploadPassport,
} from "../controllers/auth.controller.js";
import { uploadProfilePhoto } from "../controllers/auth.controller.js";
import { uploadAvatar } from "../middlewares/uploadAvatar.middleware.js";
import { uploadPassport as uploadPassportMiddleware } from "../middlewares/uploadPassport.middleware.js";





const router = Router();

// регистрация (шаги)
router.post("/check", checkUser);                        // есть пользователь или нет
router.post("/send-code", smsLimiter, sendCode);         // отправка SMS
router.post("/verify-code", smsLimiter, verifyCode);     // проверка кода
router.post("/profile/phone/verify", auth, verifyProfilePhone);
router.post("/set-password", setPassword); // установка пароля + создание пользователя
router.post("/send-email-code", sendEmailCode);     // отправка кода на email
router.post("/verify-email-code", verifyEmailCode); // проверка email-кода
router.post("/profile/photo", auth, uploadAvatar.single("file"), uploadProfilePhoto); // Загрузка фото профиля
router.post( "/profile/passport", auth, uploadPassportMiddleware.single("file"), uploadPassport );  // Загрузка паспорт
router.post( "/profile/email/verify", auth, verifyProfileEmail );



// логин
router.post("/login", loginLimiter, login);
router.post("/admin/login", loginLimiter, adminLogin)
router.get("/me", auth, me);
router.patch("/profile", auth, updateProfile);


export default router;
