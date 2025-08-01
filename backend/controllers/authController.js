const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Проверка формата Gmail
const isValidGmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

// 🔹 1. Отправка кода подтверждения
exports.sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!isValidGmail(email)) {
      return res.status(400).json({ message: 'Введите корректный Gmail-адрес' });
    }

    const normalizedEmail = email.toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing && existing.password) {
      return res.status(400).json({ message: 'Пользователь уже зарегистрирован' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 минут

    await sendEmail(normalizedEmail, verificationCode);

    // Создаём или обновляем пользователя
    const user = existing || new User({ email: normalizedEmail });
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = expires;
    user.isEmailVerified = false;

    await user.save();
    res.status(200).json({ message: 'Код отправлен на Gmail' });

  } catch (err) {
    console.error('Ошибка отправки кода:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// 🔹 2. Подтверждение кода
exports.verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.verificationCode !== code) {
      return res.status(400).json({ message: 'Неверный код' });
    }

    if (Date.now() > user.verificationCodeExpires) {
      return res.status(400).json({ message: 'Срок действия кода истёк' });
    }

    user.isEmailVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    res.status(200).json({ message: 'Email успешно подтверждён' });
  } catch (err) {
    console.error('Ошибка верификации:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// 🔹 3. Установка пароля
exports.setPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.isEmailVerified) {
      return res.status(400).json({ message: 'Email не подтверждён' });
    }

    // Устанавливаем (или обновляем) пароль
    user.password = await bcrypt.hash(password, 10);

    // ❗ После установки пароля — сбрасываем флаг подтверждения, чтобы злоумышленник не смог использовать код повторно
    user.isEmailVerified = false;

    await user.save();
    res.status(200).json({ message: 'Пароль успешно обновлён' });
  } catch (err) {
    console.error('Ошибка установки пароля:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};


// 🔹 4. Вход
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.password) {
      return res.status(404).json({ message: 'Пользователь не найден или не завершил регистрацию' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Неверный пароль' });
    }

    const token = jwt.sign({
      userId: user._id,
      role: user.role,
      isDriver: user.isDriver,
      isVerified: user.isVerified
    }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isDriver: user.isDriver,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    console.error('Ошибка входа:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// 🔐 Вход администратора
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
    if (!admin || !admin.password) {
      return res.status(404).json({ message: 'Администратор не найден' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверный пароль' });
    }

    const token = jwt.sign(
      { userId: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    console.error('Ошибка входа администратора:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
