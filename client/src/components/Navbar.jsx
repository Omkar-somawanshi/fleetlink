// frontend/src/components/Navbar.js
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ 
      padding: "1rem", 
      background: "#f4f4f4",
      borderBottom: "1px solid #ccc",
      marginBottom: "20px"
    }}>
      <Link 
        to="/add-vehicle" 
        style={{ marginRight: "1rem", textDecoration: "none", color: "#333" }}
      >
        Add Vehicle
      </Link>
      <Link 
        to="/search-book" 
        style={{ marginRight: "1rem", textDecoration: "none", color: "#333" }}
      >
        Search & Book
      </Link>
      <Link 
        to="/bookings" 
        style={{ textDecoration: "none", color: "#333" }}
      >
        Bookings
      </Link>
    </nav>
  );
}

export default Navbar;