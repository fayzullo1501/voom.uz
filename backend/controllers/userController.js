const User = require('../models/User');
const path = require('path');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { getEmailVerificationTemplate } = require('../utils/emailTemplates');
const { sendSMS } = require('../utils/sms'); // Добавь вверху файла, если ещё нет


const EMAIL_SECRET = process.env.EMAIL_SECRET || 'voomemailsecretkey';

// 🔸 Отправка письма с ссылкой подтверждения
exports.sendEmailVerificationLink = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.email) return res.status(400).json({ message: 'Email не найден' });

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Почта уже подтверждена' });
    }

    const token = jwt.sign({ id: user._id }, EMAIL_SECRET, { expiresIn: '1h' });

    // 👇 Указываем route backend-сервера, не frontend!
    const verifyUrl = `${process.env.API_BASE_URL}/users/verify-email-callback?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"VOOM" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: 'Подтвердите адрес эл. почты',
      html: getEmailVerificationTemplate(verifyUrl, user.email)
    });

    res.json({ message: 'Ссылка подтверждения отправлена на почту' });
  } catch (err) {
    console.error('Ошибка при отправке подтверждения:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// 🔸 Подтверждение email по токену
exports.verifyEmailToken = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Токен не передан' });

    let decoded;
    try {
      decoded = jwt.verify(token, EMAIL_SECRET);
    } catch (err) {
      return res.status(400).json({ message: 'Недействительный или просроченный токен' });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    // если уже подтвержден — ничего не делаем
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      await user.save();
    }

    // ✅ редирект на фронт
    return res.redirect(`${process.env.CLIENT_BASE_URL}/ru/profile/menu?email_verified=true`);
  } catch (err) {
    console.error('Ошибка подтверждения email:', err);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// 🔸 Обновление профиля
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const updatableFields = [
      'firstName', 'lastName', 'birthDate', 'phone', 'about', 'avatar',
      'passport', 'driverLicense', 'vehiclePassport', 'carNumber', 'carModel', 'carPhoto'
    ];

    let phoneChanged = false;

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'phone' && req.body.phone !== user.phone) {
          phoneChanged = true;
        }
        user[field] = req.body[field];
      }
    });

    if (req.body.requestDriver === true) {
      user.isDriver = true;
      user.isVerified = false;
    }

    // 🔁 Если номер изменён — сбрасываем верификацию, но НЕ отправляем SMS
    if (phoneChanged) {
      user.isPhoneVerified = false;
      user.phoneVerificationCode = undefined;
      user.phoneVerificationCodeExpires = undefined;
    }

    await user.save();
    res.json({ message: 'Профиль обновлён', user });
  } catch (err) {
    console.error('Ошибка обновления профиля:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};


// 🔸 Получение текущего пользователя
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -verificationCode -verificationCodeExpires');
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(user);
  } catch (err) {
    console.error('Ошибка получения профиля:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// 🔸 Загрузка аватара
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Файл не загружен' });

    const user = await User.findById(req.user._id);
    const avatarUrl = `/uploads/${req.file.filename}`;
    user.avatar = avatarUrl;

    await user.save();
    res.json({ message: 'Аватар обновлён', avatar: avatarUrl });
  } catch (err) {
    console.error('Ошибка при загрузке аватара:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// 📱 Отправка кода подтверждения телефона
exports.sendPhoneVerificationCode = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.phone) {
      return res.status(400).json({ message: 'Номер телефона не найден' });
    }

    if (user.isPhoneVerified) {
      return res.status(400).json({ message: 'Номер уже подтверждён' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 цифр
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 минут

    user.phoneVerificationCode = code;
    user.phoneVerificationCodeExpires = expires;
    await user.save();

    const { sendSMS } = require('../utils/sms');
    await sendSMS(user.phone, code); // 👉 подключена отправка через Eskiz

    res.json({ message: 'Код отправлен на телефон' });
  } catch (err) {
    console.error('Ошибка при отправке кода:', err.response?.data || err.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// ✅ Подтверждение телефона
exports.verifyPhoneCode = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user._id);

    if (!user || !user.phoneVerificationCode || !user.phoneVerificationCodeExpires) {
      return res.status(400).json({ message: 'Код не запрашивался' });
    }

    if (user.phoneVerificationCode !== code) {
      return res.status(400).json({ message: 'Неверный код' });
    }

    if (user.phoneVerificationCodeExpires < new Date()) {
      return res.status(400).json({ message: 'Срок действия кода истёк' });
    }

    user.isPhoneVerified = true;
    user.phoneVerificationCode = undefined;
    user.phoneVerificationCodeExpires = undefined;

    await user.save();
    res.json({ message: 'Номер успешно подтверждён' });
  } catch (err) {
    console.error('Ошибка при подтверждении кода:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// 🔹 Получение всех пользователей (только для админа)
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет доступа' });
    }

    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error('Ошибка получения пользователей:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// 🔹 Получение одного пользователя по ID (только для админа)
exports.getUserById = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещён' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    res.json(user);
  } catch (err) {
    console.error('Ошибка получения пользователя по ID:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// 🔹 Админ: создать пользователя
exports.createUserByAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Нет доступа' });

    const { email, password, firstName, lastName, phone, birthDate } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Почта и пароль обязательны' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Пользователь с такой почтой уже существует' });

    const user = new User({ email, password, firstName, lastName, phone, birthDate });
    await user.save();

    res.status(201).json({ message: 'Пользователь создан', user });
  } catch (err) {
    console.error('Ошибка создания пользователя:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// 🔹 Админ: обновить пользователя
exports.updateUserByAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Нет доступа' });

    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    const fields = ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'password'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save(); // Хеширование пароля сработает автоматически
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.json({ message: 'Пользователь обновлён', user: userWithoutPassword });
  } catch (err) {
    console.error('Ошибка обновления пользователя:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// 🔹 Админ: удалить нескольких пользователей
exports.deleteUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Нет доступа' });

    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Передайте массив ID для удаления' });
    }

    const result = await User.deleteMany({ _id: { $in: ids } });
    res.json({ message: `Удалено ${result.deletedCount} пользователей` });
  } catch (err) {
    console.error('Ошибка удаления пользователей:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// 🔸 Загрузка паспорта
exports.uploadPassport = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Файл не загружен' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    user.passportFile = `/uploads/passports/${req.file.filename}`;
    user.passportStatus = 'pending';
    user.passportRejectReason = '';
    await user.save();

    res.json({ message: 'Паспорт отправлен на проверку' });
  } catch (err) {
    console.error('Ошибка при загрузке паспорта:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// 🔸 Админ подтверждает паспорт
exports.confirmPassport = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Нет доступа' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    user.passportStatus = 'confirmed';
    user.passportRejectReason = '';
    if (user.isPhoneVerified) user.isDriver = true;

    await user.save();
    res.json({ message: 'Паспорт подтверждён' });
  } catch (err) {
    console.error('Ошибка подтверждения паспорта:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// 🔸 Админ отклоняет паспорт
exports.rejectPassport = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Нет доступа' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    const { reason } = req.body;
    user.passportStatus = 'rejected';
    user.passportRejectReason = reason || 'Без причины';
    user.isDriver = false;

    await user.save();
    res.json({ message: 'Паспорт отклонён' });
  } catch (err) {
    console.error('Ошибка отклонения паспорта:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};


