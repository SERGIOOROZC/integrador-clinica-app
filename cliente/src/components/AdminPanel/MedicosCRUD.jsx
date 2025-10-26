import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../services/apiServices.js";
import "./AdminPanel.css"; // usa los estilos globales

function MedicosCRUD() {
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [nuevoMedico, setNuevoMedico] = useState({
    nombre: "",
    apellido: "",
    id_especialidad: "",
    nuevaEspecialidad: "",
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  useEffect(() => {
    obtenerMedicos();
    obtenerEspecialidades();
  }, []);

  const obtenerMedicos = async () => {
    try {
      const res = await fetch(`${BASE_URL}/medico`);
      const data = await res.json();
      setMedicos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerEspecialidades = async () => {
    try {
      const res = await fetch(`${BASE_URL}/especialidad`);
      const data = await res.json();
      setEspecialidades(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setNuevoMedico({ ...nuevoMedico, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let idEspecialidad = nuevoMedico.id_especialidad;
    if (nuevoMedico.nuevaEspecialidad) {
      try {
        const res = await fetch(`${BASE_URL}/especialidad`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: nuevoMedico.nuevaEspecialidad }),
        });
        const nueva = await res.json();
        idEspecialidad = nueva.id_especialidad || nueva.id;
        await obtenerEspecialidades();
      } catch (error) {
        console.error(error);
      }
    }

    const datos = {
      nombre: nuevoMedico.nombre,
      apellido: nuevoMedico.apellido,
      id_especialidad: idEspecialidad,
    };

    try {
      const url = modoEdicion
        ? `${BASE_URL}/medico/${idEditar}`
        : `${BASE_URL}/medico`;
      const metodo = modoEdicion ? "PUT" : "POST";

      await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      obtenerMedicos();
      setNuevoMedico({ nombre: "", apellido: "", id_especialidad: "", nuevaEspecialidad: "" });
      setModoEdicion(false);
      setIdEditar(null);
    } catch (error) {
      console.error(error);
    }
  };

  const editarMedico = (medico) => {
    setNuevoMedico({
      nombre: medico.nombre,
      apellido: medico.apellido,
      id_especialidad: medico.id_especialidad,
      nuevaEspecialidad: "",
    });
    setModoEdicion(true);
    setIdEditar(medico.id_medico);
  };

  const eliminarMedico = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este médico?")) return;
    try {
      await fetch(`${BASE_URL}/medico/${id}`, { method: "DELETE" });
      obtenerMedicos();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-medicos">
      <h2>Gestión de Médicos</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={nuevoMedico.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={nuevoMedico.apellido}
          onChange={handleChange}
          required
        />
        <select
          name="id_especialidad"
          value={nuevoMedico.id_especialidad}
          onChange={handleChange}
          required={!nuevoMedico.nuevaEspecialidad}
        >
          <option value="">Seleccionar especialidad</option>
          {especialidades.map((esp) => (
            <option key={esp.id_especialidad} value={esp.id_especialidad}>
              {esp.nombre}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="nuevaEspecialidad"
          placeholder="O crear nueva especialidad"
          value={nuevoMedico.nuevaEspecialidad}
          onChange={handleChange}
        />
        <button type="submit">{modoEdicion ? "Actualizar" : "Crear"}</button>
      </form>

      {/* Tabla de Médicos */}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Especialidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {medicos.map((medico) => (
            <tr key={medico.id_medico}>
              <td>{medico.nombre}</td>
              <td>{medico.apellido}</td>
              <td>{medico.especialidad?.nombre || "-"}</td>
              <td>
                <button className="btn-edit" onClick={() => editarMedico(medico)}>
                  Editar
                </button>
                <button className="btn-delete" onClick={() => eliminarMedico(medico.id_medico)}>
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

export default MedicosCRUD;
