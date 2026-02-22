import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCar",
      required: true,
    },

    fromCity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },

    toCity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },

    fromName: { type: String, required: true },
    toName: { type: String, required: true },

    fromLat: { type: Number, required: true },
    fromLon: { type: Number, required: true },

    toLat: { type: Number, required: true },
    toLon: { type: Number, required: true },

    polyline: {
      type: String,
      default: "",
    },

    departureAt: {
      type: Date,
      required: true,
      index: true,
    },

    arrivalAt: {
      type: Date,
      index: true,
    },

    distanceMeters: {
      type: Number,
      min: 0,
    },

    durationSeconds: {
      type: Number,
      min: 0,
    },

    seatsFront: {
      type: Number,
      required: true,
      min: 0,
    },

    seatsBack: {
      type: Number,
      required: true,
      min: 0,
    },

    availableSeatsFront: {
      type: Number,
      required: true,
      min: 0,
    },

    availableSeatsBack: {
      type: Number,
      required: true,
      min: 0,
    },

    priceFront: {
      type: Number,
      required: true,
      min: 0,
    },

    priceBack: {
      type: Number,
      required: true,
      min: 0,
    },

    comment: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ["active", "in_progress", "completed", "cancelled"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

routeSchema.index({ fromCity: 1, toCity: 1, departureAt: 1 });
routeSchema.index({ driver: 1, status: 1 });

export default mongoose.model("Route", routeSchema);