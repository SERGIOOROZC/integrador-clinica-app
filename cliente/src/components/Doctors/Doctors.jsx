import React from "react";
import "./Doctors.css";

const Doctors = () => {
  const doctors = [
    { name: "Dr. Ana Pérez", specialty: "Cardiología" },
    { name: "Dr. Juan Gómez", specialty: "Neurología" },
    { name: "Dra. Laura Ruiz", specialty: "Pediatría" },
  ];

  return (
    <section className="doctors-section">
      <h2 className="section-title">Nuestros Médicos</h2>
      <div className="doctors-container">
        {doctors.map((doc, i) => (
          <div className="doctor-card" key={i}>
            <div className="doctor-avatar">{doc.name[0]}</div>
            <h3>{doc.name}</h3>
            <p>{doc.specialty}</p>
            <button className="btn-turno">Agendar Turno</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Doctors;
