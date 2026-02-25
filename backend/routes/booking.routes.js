import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  createBooking,
  acceptBooking,
  rejectBooking,
  getMyBookings,
  getBookingById,
  leaveReview,
} from "../controllers/booking.controller.js";

const router = express.Router();

// POST /api/bookings
router.post("/", auth, createBooking);

// PATCH /api/bookings/:id/accept
router.patch("/:id/accept", auth, acceptBooking);

// PATCH /api/bookings/:id/reject
router.patch("/:id/reject", auth, rejectBooking);

// GET /api/bookings/my?type=active|archive
router.get("/my", auth, getMyBookings);
router.get("/:id", auth, getBookingById);
// POST /api/bookings/:id/review
router.post("/:id/review", auth, leaveReview);

export default router;