import { Booking } from "../models/Booking.js";
import { Vehicle } from "../models/Vehicle.js";
import { calculateRideDurationHours } from "../utils/rideUtils.js";


export const createBooking = async (req, res) => {
  try {
    const { vehicleId, customerId, fromPincode, toPincode, startTime } = req.body;


    if (!vehicleId || !customerId || !fromPincode || !toPincode || !startTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check the vehicle is avaliable or not
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Calculate 
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

    // booking
    const booking = await Booking.create({
      vehicleId,
      customerId,
      fromPincode,
      toPincode,
      startTime: bookingStart,
      endTime: bookingEnd,
    });

    return res.status(201).json(booking);

  } catch (error) {
    console.error(" Error in createBooking:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
