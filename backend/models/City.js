import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
  geonameId: { type: Number, unique: true, sparse: true },
  nameRu: { type: String, required: true, trim: true },
  nameUzLat: { type: String, trim: true },
  nameUzCyr: { type: String, trim: true },
  nameEn: { type: String, trim: true },
  region: { type: String, trim: true },
  country: { type: String, default: "UZ", trim: true },
  lat: { type: Number },
  lon: { type: Number },
  population: { type: Number, default: 0 },
  priority: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

citySchema.index({ priority: -1, population: -1, _id: 1 });

export default mongoose.model("City", citySchema);
