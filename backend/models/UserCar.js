import mongoose from "mongoose";

const carPhotoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    key: { type: String, required: true },
  },
  { _id: true }
);

const userCarSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      default: null,
    },
    customBrand: {
      type: String,
      trim: true,
      maxlength: 60,
      default: null,
    },

    model: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarModel",
      default: null,
    },
    customModel: {
      type: String,
      trim: true,
      maxlength: 80,
      default: null,
    },

    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarColor",
      default: null,
    },
    customColor: {
      type: String,
      trim: true,
      maxlength: 40,
      default: null,
    },

    plateNumber: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 12,
      default: null,
    },

    productionYear: {
      type: Number,
      min: 1950,
      max: new Date().getFullYear(),
      default: null,
    },

    photos: {
      type: [carPhotoSchema],
      validate: {
        validator: (v) => v.length <= 10,
        message: "Maximum 10 photos allowed",
      },
      default: [],
    },

    status: {
      type: String,
      enum: ["draft", "active", "blocked"],
      default: "draft",
      index: true,
    },
  },
  { timestamps: true }
);

userCarSchema.index({ user: 1 });
userCarSchema.index({ brand: 1, model: 1 });
userCarSchema.index({ plateNumber: 1 }, { sparse: true });

export default mongoose.model("UserCar", userCarSchema);
