// frontend/src/pages/Bookings.js
import React, { useState, useEffect } from "react";
import api from "../services/api";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings");
      setBookings(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch bookings. Please try again later.");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await api.delete(`/bookings/${bookingId}`);
        // Refresh the bookings list
        fetchBookings();
      } catch (err) {
        setError("Failed to cancel booking");
        console.error("Error canceling booking:", err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading bookings...</div>;
  
  return (
    <div style={{ padding: "20px" }}>
      <h2>Bookings</h2>
      
      {error && (
        <div style={{ color: "red", marginBottom: "20px", padding: "10px", backgroundColor: "#ffeeee" }}>
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>No bookings found.</p>
          <p>Create your first booking from the "Search & Book" page.</p>
        </div>
      ) : (
        <div>
          <h3>All Bookings ({bookings.length})</h3>
          <div style={{ display: "grid", gap: "15px" }}>
            {bookings.map(booking => (
              <div 
                key={booking._id} 
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "15px",
                  backgroundColor: "#f9f9f9"
                }}
              >
                <div style={{ marginBottom: "10px" }}>
                  <strong>Booking ID:</strong> {booking._id}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Vehicle:</strong> {booking.vehicleId?.name || "Unknown Vehicle"}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Capacity:</strong> {booking.vehicleId?.capacityKg || "N/A"} kg
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Route:</strong> {booking.fromPincode} → {booking.toPincode}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Start Time:</strong> {formatDate(booking.startTime)}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>End Time:</strong> {formatDate(booking.endTime)}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Customer ID:</strong> {booking.customerId}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Booking Date:</strong> {formatDate(booking.createdAt)}
                </div>
                <button 
                  onClick={() => handleCancelBooking(booking._id)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Cancel Booking
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;