import React from "react";
import "./Home.css";


export default function Home() {
  return (
    <section className="home-section">
      {/* Fondo decorativo sin imagen */}
      <div className="blurred-shape-container" aria-hidden="true" />

      {/* Contenido principal */}
      <div className="home-content">
        <div className="home-bg">
          <div className="home-inner text-center">
            <h2 className="home-title">
              Bienvenidos a Clinica App Plataforma Medica las 24 hrs
            </h2>

            <p className="home-subtitle">
              Reserva tus turnos con nuestros médicos de manera rápida y segura
            </p>

            
          </div>
        </div>
      </div>
    </section>
  );
}
