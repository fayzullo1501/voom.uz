import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
      index: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    passenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    passengerName: {
      type: String,
      required: true,
      trim: true,
    },

    passengerEmail: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },

    passengerPhone: {
      type: String,
      required: true,
      match: /^\d{9}$/,
    },

    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },

    dropoffLocation: {
      type: String,
      default: "",
      trim: true,
    },

    seatType: {
      type: String,
      enum: ["front", "back"],
      required: true,
    },

    seatsCount: {
      type: Number,
      required: true,
      min: 1,
    },

    pricePerSeat: {
      type: Number,
      required: true,
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentType: {
      type: String,
      enum: ["card"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);