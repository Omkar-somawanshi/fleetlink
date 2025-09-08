// frontend/src/pages/AddVehicle.js
import React, { useState } from "react";
import api from "../services/api";

const AddVehicle = () => {
  const [form, setForm] = useState({ name: "", capacityKg: "", tyres: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    
    try {
      // Convert to numbers
      const payload = {
        ...form,
        capacityKg: parseFloat(form.capacityKg),
        tyres: parseInt(form.tyres)
      };
      
      const res = await api.post("/vehicles", payload);
      setMessage(`✅ Vehicle added: ${res.data.name}`);
      setForm({ name: "", capacityKg: "", tyres: "" });
    } catch (err) {
      setError(err.response?.data?.error || "❌ Failed to add vehicle");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Vehicle</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "250px", gap: "10px" }}>
        <input
          type="text"
          name="name"
          placeholder="Vehicle Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="capacityKg"
          placeholder="Capacity (Kg)"
          value={form.capacityKg}
          onChange={handleChange}
          required
          min="0"
        />
        <input
          type="number"
          name="tyres"
          placeholder="Tyres"
          value={form.tyres}
          onChange={handleChange}
          required
          min="0"
        />
        <button type="submit">Add Vehicle</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AddVehicle;