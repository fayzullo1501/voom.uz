import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  createBooking,
  acceptBooking,
  rejectBooking,
} from "../controllers/booking.controller.js";

const router = express.Router();

// POST /api/bookings
router.post("/", auth, createBooking);

// PATCH /api/bookings/:id/accept
router.patch("/:id/accept", auth, acceptBooking);

// PATCH /api/bookings/:id/reject
router.patch("/:id/reject", auth, rejectBooking);

export default router;