const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  from: {
    address: { type: String, required: true },
    coords: { type: [Number], required: true } // [lat, lng]
  },
  to: {
    address: { type: String, required: true },
    coords: { type: [Number], required: true }
  },
  fromCity: {
    type: String,
    required: true
  },
  toCity: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  frontSeats: {
    type: Number,
    default: 0
  },
  backSeats: {
    type: Number,
    default: 0
  },
  frontPrice: {
    type: Number,
    default: 0
  },
  backPrice: {
    type: Number,
    default: 0
  },
  comment: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Route', routeSchema);
