// src/controllers/bookingsController.js
import { Booking } from "../models/Booking.js";
import { Vehicle } from "../models/Vehicle.js";
import { calculateRideDurationHours } from "../utils/rideUtils.js";

export const createBooking = async (req, res) => {
  try {
    const { vehicleId, customerId, fromPincode, toPincode, startTime } = req.body;

    if (!vehicleId || !customerId || !fromPincode || !toPincode || !startTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check the vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Calculate ride duration
    const rideDuration = calculateRideDurationHours(
      parseInt(fromPincode),
      parseInt(toPincode)
    );

    const bookingStart = new Date(startTime);
    const bookingEnd = new Date(bookingStart);
    bookingEnd.setHours(bookingEnd.getHours() + rideDuration);

    // Check for overlapping bookings
    const conflict = await Booking.findOne({
      vehicleId,
      $or: [
        { startTime: { $lt: bookingEnd }, endTime: { $gt: bookingStart } }
      ]
    });

    if (conflict) {
      return res.status(409).json({ message: "Vehicle already booked in this time slot" });
    }

    // Create booking
    const booking = await Booking.create({
      vehicleId,
      customerId,
      fromPincode: parseInt(fromPincode),
      toPincode: parseInt(toPincode),
      startTime: bookingStart,
      endTime: bookingEnd,
    });

    // Populate vehicle details in the response
    await booking.populate("vehicleId");

    return res.status(201).json(booking);

  } catch (error) {
    console.error("❌ Error in createBooking:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add this function to get all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("vehicleId")
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(bookings);
  } catch (error) {
    console.error("❌ Error in getBookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Optional: Add delete booking function
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findByIdAndDelete(id);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("❌ Error in deleteBooking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
