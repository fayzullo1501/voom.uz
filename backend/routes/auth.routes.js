import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  checkUser,
  sendCode,
  verifyCode,
  sendEmailCode,
  verifyEmailCode,
  setPassword,
  login,
  me,
  updateProfile,
} from "../controllers/auth.controller.js";



const router = Router();

// регистрация (шаги)
router.post("/check", checkUser);       // есть пользователь или нет
router.post("/send-code", sendCode);    // отправка SMS
router.post("/verify-code", verifyCode); // проверка кода
router.post("/set-password", setPassword); // установка пароля + создание пользователя
router.post("/send-email-code", sendEmailCode);     // отправка кода на email
router.post("/verify-email-code", verifyEmailCode); // проверка email-кода




// логин
router.post("/login", login);
router.get("/me", auth, me);
router.patch("/profile", auth, updateProfile);


export default router;
