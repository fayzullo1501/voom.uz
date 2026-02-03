// models/CarModel.js
import mongoose from "mongoose";

const carModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

carModelSchema.index({ brand: 1, name: 1 }, { unique: true });

export default mongoose.model("CarModel", carModelSchema);
