const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // 👈 middleware для аватарки

// 🔹 Получение текущего пользователя
router.get('/me', authMiddleware, userController.getMe);

// 🔹 Обновление профиля
router.patch('/profile', authMiddleware, userController.updateProfile);

// 🔹 Загрузка аватарки
router.post('/avatar', authMiddleware, upload.single('avatar'), userController.uploadAvatar);

// ✅ Отправка письма подтверждения email
router.post('/verify-email', authMiddleware, userController.sendEmailVerificationLink);

// ✅ Обработка токена подтверждения (переход по ссылке)
router.get('/verify-email-callback', userController.verifyEmailToken);

// 📱 Отправка SMS-кода на номер телефона
router.post('/send-phone-code', authMiddleware, userController.sendPhoneVerificationCode);

// ✅ Подтверждение номера по коду
router.post('/verify-phone-code', authMiddleware, userController.verifyPhoneCode);

// 🔹 Получение всех пользователей (GET /api/users)
router.get('/', authMiddleware, userController.getAllUsers);

// 🔹 Получение одного пользователя по ID
router.get('/:id', authMiddleware, userController.getUserById);

// 🔹 Админ: создать, обновить, удалить
router.post('/admin-create', authMiddleware, userController.createUserByAdmin);
router.put('/:id', authMiddleware, userController.updateUserByAdmin);
router.delete('/', authMiddleware, userController.deleteUsers);

// 🔸 Загрузка паспорта (passport), с сохранением в /uploads/passports
const passportUpload = require('../middleware/passportUploadMiddleware');
router.post('/upload-passport', authMiddleware, passportUpload.single('passport'), userController.uploadPassport);

router.post('/:id/confirm-passport', authMiddleware, userController.confirmPassport);
router.post('/:id/reject-passport', authMiddleware, userController.rejectPassport);


module.exports = router;
