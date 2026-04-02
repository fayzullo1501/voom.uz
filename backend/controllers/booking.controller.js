import Booking from "../models/Booking.js";
import Route from "../models/Route.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { createNotification } from "../services/notification.service.js";

const BOOKING_FEE = 3000;


    // ===== Создать бронь =====
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

      // ❗ НОВОЕ: проверяем есть ли уже accepted брони
      const existingAccepted = await Booking.exists({
        route: route._id,
        status: "accepted",
      });

      if (existingAccepted) {
        return res.status(400).json({
          message: "cannot_book_whole_car_already_partially_booked",
        });
      }

      const totalFront = route.seatsFront;
      const totalBack = route.seatsBack;

      seatsRequested = totalFront + totalBack;

      if (seatsRequested <= 0) {
        return res.status(400).json({ message: "no_seats_available" });
      }

      totalPrice =
        totalFront * route.priceFront +
        totalBack * route.priceBack;

      pricePerSeat = null;
      finalSeatType = "whole";
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
        if (route.seatsFront < seatsRequested) {
          return res.status(400).json({ message: "invalid_seats_request" });
        }
        pricePerSeat = route.priceFront;
      }

      if (seatType === "back") {
        if (route.seatsBack < seatsRequested) {
          return res.status(400).json({ message: "invalid_seats_request" });
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

  // 👇 ВАЖНО: добавляем бронь в маршрут
  route.bookings.push(booking._id);
  await route.save();

  // уведомление водителю
  const io = req.app.get("io");
  
  await createNotification({
    userId: route.driver,
    type: "new_booking",
    title: "Новая бронь на ваш маршрут",
    route: {
      from: route.fromName,
      to: route.toName,
      departureAt: route.departureAt
    },
    routeId: route._id,
    bookingId: booking._id
  },
  io
  );

  return res.status(201).json(booking);
  } catch (error) {
    console.error("createBooking error:", error);
    return res.status(500).json({ message: "internal_server_error" });
  }
};


    // ===== Подтвердить бронь =====
export const acceptBooking = async (req, res) => {
  try {
    const driverId = req.user._id;
    const { id } = req.params;

    const booking = await Booking.findById(id).populate({
      path: "route",
      select: "fromName toName departureAt driver availableSeatsFront availableSeatsBack"
    });

    if (!booking) {
      return res.status(404).json({ message: "booking_not_found" });
    }

    const route = booking.route;

    // Проверяем что это водитель маршрута
    if (route.driver.toString() !== driverId.toString()) {
      return res.status(403).json({ message: "not_route_driver" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "booking_not_pending" });
    }

    // ==============================
    // ПРОВЕРКА БАЛАНСА
    // ==============================
    const driver = await User.findById(driverId).select("balance");

    if (!driver || driver.balance < BOOKING_FEE) {
      return res.status(402).json({
        message: "insufficient_balance",
        required: BOOKING_FEE,
        current: driver?.balance ?? 0,
      });
    }

    // ==============================
    // WHOLE CAR
    // ==============================
    if (booking.seatType === "whole") {

      // ❗ Проверяем есть ли уже accepted брони
      const existingAccepted = await Booking.exists({
        route: route._id,
        status: "accepted",
      });

      if (existingAccepted) {
        return res.status(400).json({
          message: "cannot_accept_whole_car_already_partially_booked",
        });
      }

      if (
        route.availableSeatsFront + route.availableSeatsBack <= 0
      ) {
        return res.status(400).json({ message: "no_seats_available" });
      }

      route.availableSeatsFront = 0;
      route.availableSeatsBack = 0;
    }

    // ==============================
    // FRONT
    // ==============================
    if (booking.seatType === "front") {
      if (route.availableSeatsFront < booking.seatsCount) {
        return res.status(400).json({ message: "not_enough_front_seats" });
      }

      route.availableSeatsFront -= booking.seatsCount;
    }

    // ==============================
    // BACK
    // ==============================
    if (booking.seatType === "back") {
      if (route.availableSeatsBack < booking.seatsCount) {
        return res.status(400).json({ message: "not_enough_back_seats" });
      }

      route.availableSeatsBack -= booking.seatsCount;
    }

    // ==============================
    // СПИСАНИЕ КОМИССИИ
    // ==============================
    await User.findByIdAndUpdate(driverId, { $inc: { balance: -BOOKING_FEE } });

    await Transaction.create({
      userId: driverId,
      amount: BOOKING_FEE,
      type: "debit",
      status: "success",
      provider: "internal",
      meta: { bookingId: booking._id, reason: "booking_fee" },
    });

    booking.status = "accepted";

    await route.save();
    await booking.save();

    // уведомление пассажиру
    const io = req.app.get("io");
    
    await createNotification({
      userId: booking.passenger,
      type: "booking_accepted",
      title: "Ваша бронь принята",
      route: {
        from: route.fromName,
        to: route.toName,
        departureAt: route.departureAt,
      },
      routeId: route._id,
      bookingId: booking._id
    },
    io
    );

    return res.json({ message: "booking_accepted", booking });

  } catch (error) {
    console.error("acceptBooking error:", error);
    return res.status(500).json({ message: "internal_server_error" });
  }
};


    // ===== Отклонить бронь =====
export const rejectBooking = async (req, res) => {
  try {
    const driverId = req.user._id;
    const { id } = req.params;

    const booking = await Booking.findById(id).populate({
      path: "route",
      select: "fromName toName departureAt driver availableSeatsFront availableSeatsBack"
    });

    if (!booking) {
      return res.status(404).json({ message: "booking_not_found" });
    }

    const route = booking.route;

    if (route.driver.toString() !== driverId.toString()) {
      return res.status(403).json({ message: "not_route_driver" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "booking_not_pending" });
    }

    booking.status = "rejected";
    await booking.save();

    // уведомление пассажиру
    const io = req.app.get("io");
    
    await createNotification({
      userId: booking.passenger,
      type: "booking_rejected",
      title: "Ваша бронь отклонена",
      route: {
        from: route.fromName,
        to: route.toName,
        departureAt: route.departureAt,
      },
      routeId: route._id,
      bookingId: booking._id
    },
    io
    );

    return res.json({ message: "booking_rejected", booking });

  } catch (error) {
    console.error("rejectBooking error:", error);
    return res.status(500).json({ message: "internal_server_error" });
  }
};

// ===== Мои бронирования (для пассажира) =====
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type } = req.query;

    const now = new Date();

    // Загружаем брони пользователя
    const bookings = await Booking.find({
      passenger: userId,
    })
      .populate({
        path: "route",
        populate: [
          { path: "fromCity", select: "region" },
          { path: "toCity", select: "region" },

          {
            path: "bookings",
            select: "status seatsCount",
          },
        ],
      })
      .sort({ createdAt: -1 });

    if (!bookings) {
      return res.json([]);
    }

    // Фильтрация
    const filtered = bookings.filter((b) => {
      if (!b.route) return false;

      const route = b.route;

      const isPast =
        route.departureAt < now ||
        ["completed", "cancelled"].includes(route.status) ||
        ["rejected", "cancelled"].includes(b.status);

      if (type === "archive") return isPast;
      return !isPast;
    });

    return res.json(filtered);

  } catch (error) {
    console.error("getMyBookings error:", error);
    return res.status(500).json({ message: "internal_server_error" });
  }
};

// ===== Получить одну бронь =====
export const getBookingById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate({
        path: "passenger",
        select: "firstName lastName profilePhoto",
      })
      .populate({
        path: "route",
        populate: [
          { path: "fromCity" },
          { path: "toCity" },

          {
            path: "bookings",
            populate: {
              path: "passenger",
              select: "firstName lastName profilePhoto",
            },
          },

          {
            path: "driver",
            select: `firstName lastName phone profilePhoto phoneVerified emailVerified passport rating reviewsCount`
          },

          { 
            path: "car",
            populate: [
              { path: "brand" },
              { path: "model" },
              { path: "color" }
            ]
          },
        ]
      });

    if (!booking) {
      return res.status(404).json({ message: "booking_not_found" });
    }

    // Защита: пассажир может смотреть только свою бронь
    if (booking.passenger?._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: "not_allowed" });
    }

    return res.json(booking);

  } catch (error) {
    console.error("getBookingById error:", error);
    return res.status(500).json({ message: "internal_server_error" });
  }
};

// ===== Оставить отзыв =====
export const leaveReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Проверка рейтинга
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "invalid_rating" });
    }

    const booking = await Booking.findById(id).populate("route");

    if (!booking) {
      return res.status(404).json({ message: "booking_not_found" });
    }

    // Только владелец брони
    if (booking.passenger.toString() !== userId.toString()) {
      return res.status(403).json({ message: "not_allowed" });
    }

    // Маршрут должен быть завершён
    if (booking.route.status !== "completed") {
      return res.status(400).json({ message: "route_not_completed" });
    }

    // Отзыв можно оставить только один раз
    if (booking.review?.rating) {
      return res.status(400).json({ message: "review_already_exists" });
    }

    // Сохраняем отзыв
    booking.review = {
      rating,
      comment: comment || "",
      createdAt: new Date(),
    };

    await booking.save();

    // ===== Обновляем рейтинг водителя =====
    const driverId = booking.driver;

    const driverBookings = await Booking.find({
      driver: driverId,
      "review.rating": { $ne: null },
    });

    const totalReviews = driverBookings.length;

    const totalRating = driverBookings.reduce(
      (sum, b) => sum + b.review.rating,
      0
    );

    const avgRating =
      totalReviews > 0 ? totalRating / totalReviews : 0;

    // обновляем User
    await import("../models/User.js").then(async ({ default: User }) => {
      await User.findByIdAndUpdate(driverId, {
        rating: avgRating,
        reviewsCount: totalReviews,
      });
    });

    return res.json({ message: "review_saved" });

  } catch (error) {
    console.error("leaveReview error:", error);
    return res.status(500).json({ message: "internal_server_error" });
  }
};

// ===== Отменить бронь пассажиром =====
export const cancelBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const booking = await Booking.findById(id).populate({
      path: "route",
      select: "fromName toName departureAt driver availableSeatsFront availableSeatsBack"
    });

    if (!booking) {
      return res.status(404).json({ message: "booking_not_found" });
    }

    const route = booking.route;

    // Только владелец брони может отменить
    if (booking.passenger.toString() !== userId.toString()) {
      return res.status(403).json({ message: "not_allowed" });
    }

    // Можно отменять только активный маршрут
    if (route.status !== "active") {
      return res.status(400).json({ message: "route_not_active" });
    }

    // Бронь уже отменена
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "booking_already_cancelled" });
    }

    // Возвращаем места если бронь была принята
    if (booking.status === "accepted") {

      if (booking.seatType === "front") {
        route.availableSeatsFront += booking.seatsCount;
      }

      if (booking.seatType === "back") {
        route.availableSeatsBack += booking.seatsCount;
      }

      if (booking.seatType === "whole") {
        route.availableSeatsFront = route.seatsFront;
        route.availableSeatsBack = route.seatsBack;
      }

      await route.save();
    }

    booking.status = "cancelled";
    await booking.save();

    // уведомление водителю
    const io = req.app.get("io");
    
    await createNotification({
      userId: route.driver,
      type: "booking_cancelled",
      title: "Пассажир отменил бронь",
      route: {
        from: route.fromName,
        to: route.toName,
        departureAt: route.departureAt,
      },
      routeId: route._id,
      bookingId: booking._id
    },
    io
    );

    return res.json({ message: "booking_cancelled" });

  } catch (error) {
    console.error("cancelBooking error:", error);
    return res.status(500).json({ message: "internal_server_error" });
  }
};