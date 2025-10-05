// Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../Navbar/Navbar.css"; // usamos el CSS que ya definiste

export default function Header() {
  return (
    <header>
      <nav className="navbar">
        {/* Logo */}
        <div className="navbar-logo">
          <img src="/logo.png" alt="Logo" /> {/* reemplaza con tu logo */}
        </div>

        {/* Enlaces */}
        <div className="navbar-links">
          <Link to="/signin" className="signin">Sign In</Link>
          <Link to="/signup" className="register">Register</Link>
        </div>
      </nav>
    </header>
  );
}


