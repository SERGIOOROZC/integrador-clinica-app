import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo a la izquierda */}
      <div className="navbar-logo">
        <span className="logo-text">Clinica App</span>
      </div>

      {/* Menú centrado */}
      <div className="navbar-menu">
        <Link to="/" className="nav-link">Inicio</Link>
        <Link to="/about" className="nav-link">Nosotros</Link>
        <Link to="/doctors" className="nav-link">Doctor</Link>
      </div>

      {/* Botones a la derecha */}
      <div className="navbar-links">
        <Link to="/signin" className="signin">Login</Link>
        <Link to="/signup" className="register">Registro</Link>
      </div>
    </nav>
  );
};

export default Navbar;

