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

export default app;
