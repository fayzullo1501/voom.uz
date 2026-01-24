import bcrypt from "bcryptjs";
import User from "../models/User.js";
import PhoneCode from "../models/PhoneCode.js";
import { comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import { sendSMS } from "../services/sms.service.js";
import EmailCode from "../models/EmailCode.js";
import { sendEmail } from "../services/email.service.js";


/**
 * Приведение телефона к формату 9 цифр: 901234567
 */
const normalizePhone9 = (value) => {
  if (!value) return "";
  const digits = String(value).replace(/\D/g, "");
  if (digits.startsWith("998") && digits.length >= 12) {
    return digits.slice(-9);
  }
  return digits.slice(-9);
};

const normalizeEmail = (value) => {
  if (!value) return "";
  return value.trim().toLowerCase();
};



/**
 * LOGIN
 * phone (9 цифр) + password
 */
export const login = async (req, res) => {
  const password = req.body.password;
  const phone = req.body.phone ? normalizePhone9(req.body.phone) : null;
  const email = req.body.email ? normalizeEmail(req.body.email) : null;

  if ((!phone && !email) || !password) {
    return res.status(400).json({ message: "credentials_required" });
  }

  const user = await User.findOne(phone ? { phone } : { email });
  if (!user) {
    return res.status(401).json({ message: "invalid_credentials" });
  }

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "invalid_credentials" });
  }

  const token = signToken({
    id: user._id.toString(),
    role: user.role,
  });

  res.json({
    token,
    user: {
      id: user._id,
      role: user.role,
      phone: user.phone,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      about: user.about,
      phoneVerified: user.phoneVerified,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    },
  });
};

/**
 * ME
 */
export const me = async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash");
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  res.json({
    id: user._id,
    role: user.role,
    phone: user.phone,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    birthDate: user.birthDate,
    about: user.about,
    phoneVerified: user.phoneVerified,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  });
};

/**
 * CHECK USER (при регистрации)
 */
export const checkUser = async (req, res) => {
  const phone = normalizePhone9(req.body.phone);
  const email = req.body.email?.trim().toLowerCase();

  if (!phone && !email) {
    return res.status(400).json({ message: "phone or email required" });
  }

  const exists = await User.findOne(
    phone ? { phone } : { email }
  ).lean();

  if (exists) {
    return res.status(409).json({ message: "user already exists" });
  }

  res.json({ ok: true });
};

/**
 * SEND SMS CODE
 */
export const sendCode = async (req, res) => {
  try {
    const phone = normalizePhone9(req.body.phone);

    if (!phone || phone.length !== 9) {
      return res.status(400).json({ message: "invalid_phone" });
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();

    await PhoneCode.deleteMany({ phone });

    await PhoneCode.create({
      phone,
      code,
      attempts: 0,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000),
    });

    await sendSMS(phone, code);

    res.json({ ok: true });
  } catch (err) {
    console.error("sendCode error:", err);
    res.status(500).json({ message: "sms_failed" });
  }
};

/**
 * SEND EMAIL CODE
 */
export const sendEmailCode = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({ message: "invalid_email" });
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();

    await EmailCode.deleteMany({ email });

    await EmailCode.create({
      email,
      code,
      attempts: 0,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendEmail(email, code);

    res.json({ ok: true });
  } catch (err) {
    console.error("sendEmailCode error:", err);
    res.status(500).json({ message: "email_failed" });
  }
};


/**
 * VERIFY SMS CODE
 */
export const verifyCode = async (req, res) => {
  const phone = normalizePhone9(req.body.phone);
  const code = String(req.body.code || "").trim();

  if (!phone || phone.length !== 9 || !code) {
    return res.status(400).json({ message: "phone_and_code_required" });
  }

  const record = await PhoneCode.findOne({ phone });

  if (!record) {
    return res.status(400).json({ message: "code_not_found" });
  }

  if (record.expiresAt < new Date()) {
    await PhoneCode.deleteMany({ phone });
    return res.status(400).json({ message: "code_expired" });
  }

  if (record.attempts >= 5) {
    await PhoneCode.deleteMany({ phone });
    return res.status(429).json({ message: "too_many_attempts" });
  }

  if (record.code !== code) {
    record.attempts += 1;
    await record.save();
    return res.status(400).json({ message: "invalid_code" });
  }

  // ✅ код верный
  await PhoneCode.deleteMany({ phone });

  res.json({ ok: true });
};

/**
 * VERIFY EMAIL CODE
 */
export const verifyEmailCode = async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const code = String(req.body.code || "").trim();

  if (!email || !code) {
    return res.status(400).json({ message: "email_and_code_required" });
  }

  const record = await EmailCode.findOne({ email });

  if (!record) {
    return res.status(400).json({ message: "code_not_found" });
  }

  if (record.expiresAt < new Date()) {
    await EmailCode.deleteMany({ email });
    return res.status(400).json({ message: "code_expired" });
  }

  if (record.attempts >= 5) {
    await EmailCode.deleteMany({ email });
    return res.status(429).json({ message: "too_many_attempts" });
  }

  if (record.code !== code) {
    record.attempts += 1;
    await record.save();
    return res.status(400).json({ message: "invalid_code" });
  }

  await EmailCode.deleteMany({ email });

  res.json({ ok: true });
};


/* =======================================================
   SET PASSWORD (создание пользователя + автологин)
======================================================= */
export const setPassword = async (req, res) => {
  const phone = req.body.phone ? normalizePhone9(req.body.phone) : null;
  const email = req.body.email ? normalizeEmail(req.body.email) : null;
  const password = req.body.password;

  if ((!phone && !email) || !password) {
    return res.status(400).json({ message: "credentials_required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "password_too_short" });
  }

  const exists = await User.findOne(phone ? { phone } : { email });
  if (exists) {
    return res.status(409).json({ message: "user_already_exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    phone: phone || null,
    email: email || null,
    passwordHash,
    firstName: "",
    lastName: "",
    birthDate: null,
    about: "",
    phoneVerified: !!phone,
    emailVerified: !!email,
    photoVerified: false,
    passportVerified: false,
  });


  const token = signToken({
    id: user._id.toString(),
    role: user.role,
  });

  res.json({
    token,
    user: {
      id: user._id,
      role: user.role,
      phone: user.phone,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      about: user.about,
      phoneVerified: user.phoneVerified,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    },
  });
};


/**
 * UPDATE PROFILE
 * firstName, lastName, birthDate, about
 */
export const updateProfile = async (req, res) => {
  const { firstName, lastName, birthDate, about, email, phone } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "user_not_found" });
  }

  // ===== EMAIL =====
  if (email !== undefined) {
    const normalizedEmail = email ? normalizeEmail(email) : null;

    if (normalizedEmail) {
      const exists = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (exists) {
        return res.status(409).json({ message: "email_already_in_use" });
      }
    }

    user.email = normalizedEmail;
    user.emailVerified = false;
  }

  // ===== PHONE =====
  if (phone !== undefined) {
    const normalizedPhone = phone ? normalizePhone9(phone) : null;

    if (normalizedPhone) {
      const exists = await User.findOne({
        phone: normalizedPhone,
        _id: { $ne: user._id },
      });

      if (exists) {
        return res.status(409).json({ message: "phone_already_in_use" });
      }
    }

    user.phone = normalizedPhone;
    user.phoneVerified = false;
  }

  // ===== OTHER FIELDS =====
  if (typeof firstName === "string") user.firstName = firstName.trim();
  if (typeof lastName === "string") user.lastName = lastName.trim();
  if (birthDate !== undefined) user.birthDate = birthDate || null;
  if (typeof about === "string") user.about = about.trim();

  await user.save();

  res.json({
    id: user._id,
    role: user.role,
    phone: user.phone,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    birthDate: user.birthDate,
    about: user.about,
    phoneVerified: user.phoneVerified,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  });
};

