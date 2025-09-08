// frontend/src/App.js
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddVehicle from "./pages/AddVehicle";
import SearchAndBook from "./pages/SearchAndBook";
import Bookings from "./pages/Bookings";
import "./App.css";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/add-vehicle" replace />} />
        <Route path="/add-vehicle" element={<AddVehicle />} />
        <Route path="/search-book" element={<SearchAndBook />} />
        <Route path="/bookings" element={<Bookings />} />
      </Routes>
    </div>
  );
}

export default App;