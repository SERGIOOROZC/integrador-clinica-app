// src/components/AdminPanel/TurnoList.jsx
import React, { useEffect, useState } from "react";
// Importamos todas las funciones necesarias de nuestro servicio de API
import { obtenerTurnosAPI, actualizarTurnoAPI, eliminarTurnoAPI } from "../../services/apiServices.js"; 
// Importamos los estilos actualizados
import "./AdminPanel.css";

function TurnoList() {
  // 💾 ESTADOS: Variables de memoria del componente
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  // 💡 ROL DE USUARIO: Simulamos el rol logueado para controlar permisos
  // ¡Mantendremos "admin" para que veas todos los botones funcionales!
  const [userRole, setUserRole] = useState("admin"); 

  // 🛠️ Función Helper: El "portero digital"
  // Revisa si el rol del usuario (userRole) está en la lista de roles permitidos (allowedRoles).
  const isAuthorized = (allowedRoles) => allowedRoles.includes(userRole);

  // 🔹 Cargar todos los turnos
  const fetchTurnos = async () => {
    setLoading(true);
    setError("");
    try {
      // 🚀 Solicitud a la API
      const data = await obtenerTurnosAPI(); 
      setTurnos(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los turnos");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 EFECTO: Llama a cargar turnos solo la primera vez que se monta el componente
  useEffect(() => {
    fetchTurnos();
  }, []);

  // 🔹 Actualizar el estado (Lógica para "Confirmar Turno")
  const actualizarEstadoTurno = async (id, nuevoEstado) => {
    try {
      // 📝 Enviamos la actualización del estado al servidor
      await actualizarTurnoAPI(id, { estado: nuevoEstado });
      
      setMessage(`Turno ${id} actualizado a: ${nuevoEstado}`);
      
      // 🔄 Recargamos la lista para mostrar el estado actualizado
      fetchTurnos();
    } catch (err) {
      console.error(err);
      setError("Error al actualizar el estado del turno.");
    }
  };
  
  // 🔹 Eliminar turno (Usando la función centralizada de la API)
  const eliminarTurno = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este turno?")) return;

    try {
      // 🔥 Solicitud de borrado al servidor
      await eliminarTurnoAPI(id); 
      setMessage("Turno eliminado correctamente");
      fetchTurnos();
    } catch (err) {
      console.error(err);
      setError("Error al eliminar el turno");
    }
  };

  // 🎨 RENDERIZADO
  return (
    <div className="admin-panel">
      <h2>Lista de Turnos</h2>
      {loading && <p>Cargando turnos...</p>}
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      {/* Mensaje si no hay turnos */}
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
                <td>{t.paciente}</td>
                <td>{t.medico}</td>
                {/* Asumimos que el campo se llama t.especialidad */}
                <td>{t.especialidad}</td>
                <td>{t.fecha}</td>
                <td>{t.hora}</td>
                <td>
                  {/* 💡 Estilo dinámico según el estado (ej: estado-pendiente) */}
                  <span className={`estado-${t.estado ? t.estado.toLowerCase() : 'n/a'}`}>
                    {t.estado || 'N/A'}
                  </span>
                </td>
                <td>
                  {/* 💡 GRUPO DE ACCIONES: Usamos la nueva clase para alinear los botones */}
                  <div className="btn-group-acciones">
                    
                    {/* 1. Botón CONFIRMAR */}
                    {/* Condición: Solo si está Pendiente Y el usuario tiene permiso */}
                    {t.estado === "Pendiente" && isAuthorized(["admin", "medico"]) && (
                      <button
                        className="btn-confirmar" // Estilo verde
                        onClick={() => actualizarEstadoTurno(t.id_turno, "Confirmado")}
                      >
                        Confirmar
                      </button>
                    )}
                    
                    {/* 2. Botón EDITAR */}
                    {/* Condición: Solo si el usuario es Admin o Médico */}
                    {isAuthorized(["admin", "medico"]) && (
                      <button 
                          className="btn-edit" // Estilo morado
                          onClick={() => alert(`Preparando edición de turno ${t.id_turno}`)}
                      >
                        Editar
                      </button>
                    )}

                    {/* 3. Botón ELIMINAR */}
                    {/* Condición: Solo si el usuario es Admin (Máxima restricción) */}
                    {isAuthorized(["admin"]) && (
                      <button
                        className="btn-delete" // Estilo rojo
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