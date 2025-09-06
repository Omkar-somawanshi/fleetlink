import express from "express";
import { createBooking } from "../controllers/bookingsController.js";

const router = express.Router();

// POST /api/bookings -> Create booking
router.post("/", createBooking);

export default router;
