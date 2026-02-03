// models/CarColor.js
import mongoose from "mongoose";

const carColorSchema = new mongoose.Schema(
  {
    nameRu: { type: String, required: true, trim: true, maxlength: 50 },
    nameUz: { type: String, required: true, trim: true, maxlength: 50 },
    nameEn: { type: String, required: true, trim: true, maxlength: 50 },
    hex: { type: String, required: true, uppercase: true, trim: true, match: /^#([0-9A-F]{6})$/ },
    status: { type: String, enum: ["active", "inactive"], default: "active", index: true },
  },
  { timestamps: true }
);

carColorSchema.index({ hex: 1 }, { unique: true });

export default mongoose.model("CarColor", carColorSchema);
