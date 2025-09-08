// src/routes/bookings.js
import express from "express";
import { createBooking, getBookings, deleteBooking } from "../controllers/bookingsController.js";

const router = express.Router();

// POST /api/bookings -> Create booking
router.post("/", createBooking);

// GET /api/bookings -> Get all bookings
router.get("/", getBookings);

// DELETE /api/bookings/:id -> Delete a booking
router.delete("/:id", deleteBooking);

export default router;