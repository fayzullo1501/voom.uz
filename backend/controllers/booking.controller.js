import Booking from "../models/Booking.js";
import Route from "../models/Route.js";

export const createBooking = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      routeId,
      passengerName,
      passengerEmail,
      passengerPhone,
      pickupLocation,
      dropoffLocation,
      seatType,
      seatsCount,
      paymentType,
      message,
      bookWholeCar, // 👈 ДОБАВИЛИ
    } = req.body;

    // ===== BASIC VALIDATION =====
    if (
      !routeId ||
      !passengerName ||
      !passengerPhone ||
      !pickupLocation ||
      !paymentType
    ) {
      return res.status(400).json({ message: "required_fields_missing" });
    }

    if (!["cash", "card"].includes(paymentType)) {
      return res.status(400).json({ message: "invalid_payment_type" });
    }

    if (!pickupLocation.address) {
      return res.status(400).json({ message: "pickup_required" });
    }

    // ===== FIND ROUTE =====
    const route = await Route.findOne({
      _id: routeId,
      status: "active",
    });

    if (!route) {
      return res.status(404).json({ message: "route_not_found" });
    }

    if (route.driver.toString() === userId.toString()) {
      return res.status(400).json({ message: "cannot_book_own_route" });
    }

    let seatsRequested;
    let pricePerSeat = null;
    let totalPrice = 0;
    let finalSeatType = null;

    // ==============================
    // WHOLE CAR LOGIC
    // ==============================
    if (bookWholeCar) {
      const totalFront = route.availableSeatsFront;
      const totalBack = route.availableSeatsBack;

      seatsRequested = totalFront + totalBack;

      if (seatsRequested <= 0) {
        return res.status(400).json({ message: "no_seats_available" });
      }

      totalPrice =
        totalFront * route.priceFront +
        totalBack * route.priceBack;

      pricePerSeat = null;
      finalSeatType = "whole"; // 🔥 ВОТ ЭТО ГЛАВНОЕ
    }

    // ==============================
    // NORMAL SEAT LOGIC
    // ==============================
    else {
      if (!["front", "back"].includes(seatType)) {
        return res.status(400).json({ message: "invalid_seat_type" });
      }

      seatsRequested = Number(seatsCount);

      if (seatsRequested <= 0) {
        return res.status(400).json({ message: "invalid_seats_count" });
      }

      if (seatType === "front") {
        if (route.availableSeatsFront < seatsRequested) {
          return res.status(400).json({ message: "not_enough_front_seats" });
        }
        pricePerSeat = route.priceFront;
      }

      if (seatType === "back") {
        if (route.availableSeatsBack < seatsRequested) {
          return res.status(400).json({ message: "not_enough_back_seats" });
        }
        pricePerSeat = route.priceBack;
      }

      totalPrice = pricePerSeat * seatsRequested;
      finalSeatType = seatType;
    }

    // ===== CREATE BOOKING =====
    const booking = await Booking.create({
      route: route._id,
      driver: route.driver,
      passenger: userId,

      passengerName,
      passengerEmail: passengerEmail || null,
      passengerPhone,
      message: message || "",

      pickupLocation,
      dropoffLocation: dropoffLocation || {
        address: "",
        lat: null,
        lng: null,
      },

      seatType: finalSeatType,
      seatsCount: seatsRequested,

      pricePerSeat,
      totalPrice,

      paymentType,
      status: "pending",
    });

    return res.status(201).json(booking);
  } catch (error) {
    console.error("createBooking error:", error);
    return res.status(500).json({ message: "internal_server_error" });
  }
};