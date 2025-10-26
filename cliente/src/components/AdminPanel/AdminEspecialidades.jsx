import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../services/apiServices.js";
import "./AdminPanel.css";

function AdminEspecialidades() {
  const [especialidades, setEspecialidades] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // 🔹 Obtener especialidades desde la API
  const fetchEspecialidades = async () => {
    try {
      const res = await fetch(`${BASE_URL}/especialidad`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setEspecialidades(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las especialidades");
    }
  };

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  // 🔹 Crear o actualizar una especialidad
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const url = editId
        ? `${BASE_URL}/especialidad/${editId}`
        : `${BASE_URL}/especialidad`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ nombre }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error en la operación");

      setMessage(editId ? "Especialidad actualizada" : "Especialidad creada");
      setNombre("");
      setEditId(null);
      fetchEspecialidades();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Eliminar una especialidad
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta especialidad?")) return;

    try {
      const res = await fetch(`${BASE_URL}/especialidad/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar");
      setMessage("Especialidad eliminada correctamente");
      fetchEspecialidades();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // 🔹 Editar una especialidad
  const handleEdit = (esp) => {
    setNombre(esp.nombre);
    setEditId(esp.id_especialidad);
  };

  return (
    <div className="admin-section">
      <h2>CRUD de Especialidades</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="form-admin">
        <input
          type="text"
          placeholder="Nombre de la especialidad"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : editId ? "Actualizar" : "Crear"}
        </button>
      </form>

      <ul className="lista-especialidades">
        {especialidades.map((esp) => (
          <li key={esp.id_especialidad}>
            <span>{esp.nombre}</span>
            <div className="botones-especialidad">
              <button
                className="btn-edit"
                onClick={() => handleEdit(esp)}
              >
                Editar
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDelete(esp.id_especialidad)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminEspecialidades;
