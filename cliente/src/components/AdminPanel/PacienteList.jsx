// src/components/AdminPanel/PacienteList.jsx
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../services/apiServices.js";
import "./AdminPanel.css";

function PacienteList() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // 🔹 Cargar pacientes
  const fetchPacientes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/usuario`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();

      // 🔹 Filtrar solo pacientes
      const pacientesFiltrados = data.usuarios.filter(u => u.rol === "paciente");
      setPacientes(pacientesFiltrados);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los pacientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  // 🔹 Eliminar paciente
  const eliminarPaciente = async (id_usuario) => {
    if (!window.confirm("¿Seguro que deseas eliminar este paciente?")) return;

    try {
      const res = await fetch(`${BASE_URL}/usuario/${id_usuario}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Error al eliminar paciente");

      setMessage("Paciente eliminado correctamente");

      // 🔹 Actualizar la lista inmediatamente
      setPacientes(prev => prev.filter(p => p.id_usuario !== id_usuario));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Lista de Pacientes</h2>

      {loading && <p>Cargando pacientes...</p>}
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <table className="tabla-admin">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Edad</th>
            <th>DNI</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((p) => (
            <tr key={p.id_usuario}>
              <td>{p.id_usuario}</td>
              <td>{p.nombre}</td>
              <td>{p.apellido}</td>
              <td>{p.email}</td>
              <td>{p.edad || "-"}</td>
              <td>{p.dni || "-"}</td>
              <td>{p.telefono || "-"}</td>
              <td>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarPaciente(p.id_usuario)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PacienteList;
