const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  geonameId: { type: Number, unique: true, sparse: true }, // ID из GeoNames, можно null для вручную добавленных городов
  nameRu: { type: String, required: true, trim: true },
  nameUzLat: { type: String, trim: true },
  nameUzCyr: { type: String, trim: true },
  nameEn: { type: String, trim: true },
  region: { type: String, trim: true },
  country: { type: String, default: 'UZ', trim: true },
  lat: { type: Number },
  lon: { type: Number },
  population: { type: Number, default: 0 },
  priority: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });


// 🔹 Индекс для ускорения сортировки и выборки
citySchema.index({ priority: -1, population: -1, _id: 1 });

module.exports = mongoose.model('City', citySchema);
