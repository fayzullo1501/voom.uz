const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 🔹 Этапы регистрации
router.post('/send-code', authController.sendVerificationCode);   // 1. Отправка кода
router.post('/verify-code', authController.verifyCode);           // 2. Подтверждение кода
router.post('/set-password', authController.setPassword);         // 3. Установка пароля

// 🔹 Вход
router.post('/login', authController.login);

// 🔐 Вход администратора
router.post('/admin-login', authController.adminLogin);

// 🔧 ВРЕМЕННО: ручной ввод администратора
// 🔧 ВРЕМЕННО: ручной ввод администратора (ИСПРАВЛЕНО)
router.post('/create-admin', async (req, res) => {
  const User = require('../models/User');

  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: 'Админ уже существует' });
    }

    const admin = new User({
      email: email.toLowerCase(),
      password: password, // 👈 НЕ ХЕШИРУЕМ!
      role: 'admin',
      isEmailVerified: true
    });

    await admin.save(); // хеш произойдёт в userSchema.pre('save')
    res.status(201).json({ message: 'Админ успешно создан', admin });
  } catch (err) {
    console.error('Ошибка создания админа:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


module.exports = router;
