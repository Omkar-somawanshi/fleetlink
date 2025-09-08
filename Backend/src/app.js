// src/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";

import vehicleRoutes from "./routes/vehicles.js";
import bookingRoutes from "./routes/bookings.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the FleetLink API!");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

export default app;