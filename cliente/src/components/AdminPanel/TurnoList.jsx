// src/components/AdminPanel/TurnoList.jsx
import React, { useEffect, useState } from "react";
import { obtenerTurnosAPI, actualizarTurnoAPI, eliminarTurnoAPI } from "../../services/apiServices.js";
import "./AdminPanel.css";

function TurnoList() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Simulamos que el usuario es admin para mostrar todos los botones
  const [userRole, setUserRole] = useState("admin"); 
  const isAuthorized = (allowedRoles) => allowedRoles.includes(userRole);

  // Estados válidos según la tabla en la base de datos
  const estadosDisponibles = ["Pendiente", "Reservado", "Cancelado", "Confirmado"];

  // 🔹 Cargar todos los turnos
  const fetchTurnos = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await obtenerTurnosAPI();
      setTurnos(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los turnos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurnos();
  }, []);

  // 🔹 Actualizar estado del turno
  const actualizarEstadoTurno = async (id, nuevoEstado) => {
    try {
      const datos = { estado: nuevoEstado }; // Solo enviamos el campo permitido
      await actualizarTurnoAPI(id, datos);

      // Actualizamos localmente sin recargar toda la lista
      setTurnos(prev =>
        prev.map(turno =>
          turno.id_turno === id ? { ...turno, estado: nuevoEstado } : turno
        )
      );

      setMessage(`Turno ${id} actualizado a: ${nuevoEstado}`);
      setError("");
    } catch (err) {
      console.error("Error al actualizar el turno:", err);
      setError("Error al actualizar el estado del turno. Revisa que el valor sea válido.");
    }
  };

  // 🔹 Eliminar turno
  const eliminarTurno = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este turno?")) return;
    try {
      await eliminarTurnoAPI(id);
      setTurnos(prev => prev.filter(turno => turno.id_turno !== id));
      setMessage("Turno eliminado correctamente");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error al eliminar el turno");
    }
  };

  return (
    <div className="admin-panel">
      <h2>Lista de Turnos</h2>
      {loading && <p>Cargando turnos...</p>}
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      {turnos.length === 0 && !loading && <p>No hay turnos disponibles.</p>}

      {turnos.length > 0 && (
        <table className="tabla-admin">
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Especialidad</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((t) => (
              <tr key={t.id_turno}>
                <td>{t.id_turno}</td>
                <td>{t.paciente || "Sin paciente"}</td>
                <td>{t.medico}</td>
                <td>{t.especialidad || "Sin especialidad"}</td>
                <td>{t.fecha}</td>
                <td>{t.hora}</td>
                <td>
                  {isAuthorized(["admin", "medico"]) ? (
                    <select
                      value={t.estado}
                      onChange={(e) => actualizarEstadoTurno(t.id_turno, e.target.value)}
                      className={`estado-${t.estado ? t.estado.toLowerCase() : "pendiente"}`}
                    >
                      {estadosDisponibles.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className={`estado-${t.estado ? t.estado.toLowerCase() : "pendiente"}`}>
                      {t.estado}
                    </span>
                  )}
                </td>
                <td>
                  <div className="btn-group-acciones">
                    {t.estado === "Pendiente" && isAuthorized(["admin", "medico"]) && (
                      <button
                        className="btn-confirmar"
                        onClick={() => actualizarEstadoTurno(t.id_turno, "Confirmado")}
                      >
                        Confirmar
                      </button>
                    )}
                    {isAuthorized(["admin", "medico"]) && (
                      <button 
                        className="btn-edit"
                        onClick={() => alert(`Preparando edición de turno ${t.id_turno}`)}
                      >
                        Editar
                      </button>
                    )}
                    {isAuthorized(["admin"]) && (
                      <button
                        className="btn-delete"
                        onClick={() => eliminarTurno(t.id_turno)}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TurnoList;
