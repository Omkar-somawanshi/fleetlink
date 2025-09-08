// src/routes/vehicles.js
import express from "express";
import { addVehicle, getAvailableVehicles } from "../controllers/vehiclesController.js";

const router = express.Router();

// POST /api/vehicles -> Add a vehicle
router.post("/", addVehicle);

// GET /api/vehicles/available -> Search available vehicles
router.get("/available", getAvailableVehicles);

export default router;