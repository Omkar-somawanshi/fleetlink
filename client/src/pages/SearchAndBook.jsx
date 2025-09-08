// frontend/src/pages/SearchAndBook.js
import React, { useState } from "react";
import api from "../services/api";

const SearchAndBook = () => {
  const [searchData, setSearchData] = useState({
    capacityRequired: "",
    fromPincode: "",
    toPincode: "",
    startTime: ""
  });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setVehicles([]);
    setMessage("");
    setError("");

    try {
      const response = await api.get("/vehicles/available", {
        params: {
          capacityRequired: searchData.capacityRequired,
          fromPincode: searchData.fromPincode,
          toPincode: searchData.toPincode,
          startTime: searchData.startTime
        }
      });

      setVehicles(response.data);
      if (response.data.length === 0) {
        setMessage("No vehicles available for the specified criteria");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to search vehicles");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (vehicleId) => {
    setMessage("");
    setError("");

    try {
      const bookingData = {
        vehicleId,
        fromPincode: searchData.fromPincode,
        toPincode: searchData.toPincode,
        startTime: searchData.startTime,
        customerId: "customer1" // Hardcoded for simplicity
      };

      await api.post("/bookings", bookingData);
      setMessage("Booking successful!");
      setVehicles([]); // Clear results to force new search
    } catch (err) {
      setError(err.response?.data?.error || "Failed to book vehicle");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Search & Book Vehicles</h2>
      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      
      <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
        <input
          type="number"
          name="capacityRequired"
          placeholder="Capacity Required (KG)"
          value={searchData.capacityRequired}
          onChange={handleChange}
          min="0"
          required
        />
        <input
          type="text"
          name="fromPincode"
          placeholder="From Pincode"
          value={searchData.fromPincode}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="toPincode"
          placeholder="To Pincode"
          value={searchData.toPincode}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="startTime"
          value={searchData.startTime}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search Availability"}
        </button>
      </form>

      {vehicles.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Available Vehicles</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {vehicles.map(vehicle => (
              <div key={vehicle._id} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "4px" }}>
                <div>
                  <strong>{vehicle.name}</strong> - Capacity: {vehicle.capacityKg}kg, 
                  Tyres: {vehicle.tyres}, Estimated Duration: {vehicle.estimatedRideDurationHours} hours
                </div>
                <button onClick={() => handleBook(vehicle._id)} style={{ marginTop: "10px" }}>
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndBook;