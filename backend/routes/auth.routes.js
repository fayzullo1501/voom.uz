import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
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
  me,
  updateProfile,
  uploadPassport,
} from "../controllers/auth.controller.js";
import { uploadProfilePhoto } from "../controllers/auth.controller.js";
import { uploadAvatar } from "../middlewares/uploadAvatar.middleware.js";
import { uploadPassport as uploadPassportMiddleware } from "../middlewares/uploadPassport.middleware.js";





const router = Router();

// регистрация (шаги)
router.post("/check", checkUser);       // есть пользователь или нет
router.post("/send-code", sendCode);    // отправка SMS
router.post("/verify-code", verifyCode); // проверка кода
router.post("/profile/phone/verify", auth, verifyProfilePhone);
router.post("/set-password", setPassword); // установка пароля + создание пользователя
router.post("/send-email-code", sendEmailCode);     // отправка кода на email
router.post("/verify-email-code", verifyEmailCode); // проверка email-кода
router.post("/profile/photo", auth, uploadAvatar.single("file"), uploadProfilePhoto); // Загрузка фото профиля
router.post( "/profile/passport", auth, uploadPassportMiddleware.single("file"), uploadPassport );  // Загрузка паспорт
router.post( "/profile/email/verify", auth, verifyProfileEmail );



// логин
router.post("/login", login);
router.get("/me", auth, me);
router.patch("/profile", auth, updateProfile);


export default router;
