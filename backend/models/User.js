import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      default: "",
    },

    lastName: {
      type: String,
      trim: true,
      default: "",
    },

    birthDate: {
      type: Date,
      default: null,
    },

    about: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      match: /^\d{9}$/, // 901234567
      index: true,
      default: null,
    },

    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      index: true,
      default: null,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },

    /* ===== ВЕРИФИКАЦИИ ===== */

    phoneVerified: {
      type: Boolean,
      default: false,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    profilePhoto: {
      url: {
        type: String,
        default: null,
      },

      status: {
        type: String,
        enum: ["empty", "pending", "approved", "rejected"],
        default: "empty",
      },

      rejectionReason: {
        type: String,
        default: "",
      },

      uploadedAt: {
        type: Date,
        default: null,
      },

      reviewedAt: {
        type: Date,
        default: null,
      },
    },


    passportVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
