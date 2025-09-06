import { Vehicle } from "../models/Vehicle.js";
import { Booking } from "../models/Booking.js";
import { calculateRideDurationHours } from "../utils/rideUtils.js";

/**
 * @desc Add a new vehicle
 * @route POST /api/vehicles
 */
export const addVehicle = async (req, res) => {
  try {
    const { name, capacityKg, tyres } = req.body;

    if (!name || !capacityKg || !tyres) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const vehicle = await Vehicle.create({ name, capacityKg, tyres });
    return res.status(201).json(vehicle);

  } catch (error) {
    console.error("❌ Error in addVehicle:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Get available vehicles based on search criteria
 * @route GET /api/vehicles/available
 */
export const getAvailableVehicles = async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;

    if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Calculate ride duration
    const rideDuration = calculateRideDurationHours(
      parseInt(fromPincode),
      parseInt(toPincode)
    );

    const bookingStart = new Date(startTime);
    const bookingEnd = new Date(bookingStart);
    bookingEnd.setHours(bookingEnd.getHours() + rideDuration);

    // Step 1: find vehicles with enough capacity
    const vehicles = await Vehicle.find({
      capacityKg: { $gte: capacityRequired },
    });

    // Step 2: filter out vehicles with conflicting bookings
    const availableVehicles = [];
    for (const vehicle of vehicles) {
      const conflict = await Booking.findOne({
        vehicleId: vehicle._id,
        $or: [
          { startTime: { $lt: bookingEnd }, endTime: { $gt: bookingStart } }
        ]
      });

      if (!conflict) {
        availableVehicles.push({
          ...vehicle.toObject(),
          estimatedRideDurationHours: rideDuration,
        });
      }
    }

    res.status(200).json(availableVehicles);

  } catch (error) {
    console.error("❌ Error in getAvailableVehicles:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
