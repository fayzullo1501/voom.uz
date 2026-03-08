import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "new_booking",
        "booking_accepted",
        "booking_rejected",
        "route_cancelled",
        "booking_cancelled",
      ],
      required: true,
    },

    title: String,

    route: {
      from: String,
      to: String,
      departureAt: Date,
    },

    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      default: null
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);