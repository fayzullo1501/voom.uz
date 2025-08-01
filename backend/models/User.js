const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    type: String,
    default: null
  },
  verificationCodeExpires: {
    type: Date,
    default: null
  },

  // Профиль
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  birthDate: { type: Date },
  phone: {
    type: String,
    trim: true,
    default: undefined,
    unique: true,
    sparse: true
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  phoneVerificationCode: {
    type: String,
    default: null
  },
  phoneVerificationCodeExpires: {
    type: Date,
    default: null
  },
  about: { type: String, trim: true },
  avatar: { type: String },

  // Паспорт
  passportStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected'],
    default: null
  },
  passportFile: {
    type: String,
    default: null
  },
  passportRejectReason: {
    type: String,
    default: ''
  },

  // Водитель
  passport: String,
  driverLicense: String,
  carModel: String,
  carNumber: String,
  carPhoto: String,
  techPassport: String,

  isDriver: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },

  // Роль
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }

}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);
