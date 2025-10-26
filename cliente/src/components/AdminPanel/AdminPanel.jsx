// src/components/AdminPanel/AdminPanel.jsx
import React, { useState } from "react";
import AdminEspecialidades from "./AdminEspecialidades";
import PacienteList from "./PacienteList";
import TurnoList from "./TurnoList";
import MedicosCRUD from "./MedicosCRUD";
import { useAuth } from "../../context/AuthContext";
import "./AdminPanel.css";

function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("especialidades");

  if (!user || user.rol !== "admin") {
    return <div>No tienes permisos para ver esta sección.</div>;
  }

  return (
    <div className="admin-panel">
      <h2 className="titulo-admin">Panel de Administración</h2>

      {/* Menú de pestañas */}
      <div className="menu-admin">
        <button
          className={activeTab === "especialidades" ? "activo" : ""}
          onClick={() => setActiveTab("especialidades")}
        >
          Especialidades
        </button>
        <button
          className={activeTab === "pacientes" ? "activo" : ""}
          onClick={() => setActiveTab("pacientes")}
        >
          Pacientes
        </button>
        <button
          className={activeTab === "turnos" ? "activo" : ""}
          onClick={() => setActiveTab("turnos")}
        >
          Turnos
        </button>
        <button
          className={activeTab === "medicos" ? "activo" : ""}
          onClick={() => setActiveTab("medicos")}
        >
          Médicos
        </button>
      </div>

      {/* Contenido según la pestaña activa */}
      <div className="contenido-admin">
        {activeTab === "especialidades" && <AdminEspecialidades />}
        {activeTab === "pacientes" && <PacienteList />}
        {activeTab === "turnos" && <TurnoList />}
        {activeTab === "medicos" && <MedicosCRUD />}
      </div>
    </div>
  );
}

export default AdminPanel;
