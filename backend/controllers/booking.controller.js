// controllers/booking.controller.js
import Booking from "../models/Booking.js";
import Route from "../models/Route.js";

/**
 * ===============================
 * POST /api/bookings
 * create booking
 * ===============================
 */
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
    } = req.body;

    // ===== BASIC VALIDATION =====
    if (
      !routeId ||
      !passengerName ||
      !passengerPhone ||
      !pickupLocation ||
      !seatType ||
      !seatsCount ||
      !paymentType
    ) {
      return res.status(400).json({ message: "required_fields_missing" });
    }

    if (!["front", "back"].includes(seatType)) {
      return res.status(400).json({ message: "invalid_seat_type" });
    }

    if (paymentType !== "card") {
      return res.status(400).json({ message: "invalid_payment_type" });
    }

    // ===== FIND ROUTE =====
    const route = await Route.findOne({
      _id: routeId,
      status: "active",
    });

    if (!route) {
      return res.status(404).json({ message: "route_not_found" });
    }

    // ===== DRIVER CANNOT BOOK OWN ROUTE =====
    if (route.driver.toString() === userId.toString()) {
      return res.status(400).json({ message: "cannot_book_own_route" });
    }

    const seatsRequested = Number(seatsCount);

    if (seatsRequested <= 0) {
      return res.status(400).json({ message: "invalid_seats_count" });
    }

    // ===== CHECK AVAILABLE SEATS =====
    if (seatType === "front") {
      if (route.availableSeatsFront < seatsRequested) {
        return res.status(400).json({ message: "not_enough_front_seats" });
      }
    }

    if (seatType === "back") {
      if (route.availableSeatsBack < seatsRequested) {
        return res.status(400).json({ message: "not_enough_back_seats" });
      }
    }

    // ===== PRICE CALCULATION =====
    const pricePerSeat =
      seatType === "front" ? route.priceFront : route.priceBack;

    const totalPrice = pricePerSeat * seatsRequested;

    // ===== CREATE BOOKING =====
    const booking = await Booking.create({
      route: route._id,
      driver: route.driver,
      passenger: userId,

      passengerName,
      passengerEmail: passengerEmail || null,
      passengerPhone,

      pickupLocation,
      dropoffLocation: dropoffLocation || "",

      seatType,
      seatsCount: seatsRequested,

      pricePerSeat,
      totalPrice,

      paymentType,
    });

    return res.status(201).json(booking);
  } catch (error) {
    console.error("createBooking error:", error);
    return res.status(500).json({ message: "internal_server_error" });
  }
};