import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../services/apiServices.js";
import "./AdminPanel.css"; 

// =========================================================
// 💡 UTILIDAD CRÍTICA: Obtener el token (asumimos que está en localStorage)
// =========================================================
const getToken = () => localStorage.getItem('token'); 

// =========================================================
// 💡 UTILIDAD: Crear headers con autenticación
// =========================================================
const getAuthHeaders = (contentType = 'application/json') => ({
    'Content-Type': contentType,
    'Authorization': `Bearer ${getToken()}`,
});

function MedicosCRUD() {
    // 🔑 El estado debe inicializarse como un array vacío para evitar TypeError.
    const [medicos, setMedicos] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [nuevoMedico, setNuevoMedico] = useState({
        // IMPORTANTE: Recuerda que tu backend requiere 'id_usuario' para POST
        id_usuario: "", // Añadir este campo para que el backend no devuelva 400
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

    // =========================================================
    // 🔹 OBTENER MÉDICOS (R) - CORREGIDO para extraer el array anidado
    // =========================================================
    const obtenerMedicos = async () => {
        const token = getToken();
        console.log("Token para /medico:", token ? "Token cargado OK" : "Token NO ENCONTRADO"); 

        try {
            const res = await fetch(`${BASE_URL}/medico`, {
                headers: { 'Authorization': `Bearer ${token}` }, // Envía el token
            });

            if (!res.ok) {
                // Si falla (401, 403, 500, etc.), lanzamos error
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            
            // ✅ CORRECCIÓN CLAVE: El controlador devuelve { mensaje, medicos: [] }
            // Extraemos el array 'medicos' anidado.
            setMedicos(data.medicos || []); 
            
        } catch (error) {
            console.error("Error al obtener médicos:", error);
            setMedicos([]); // Asegura que el estado es un array vacío en caso de fallo
        }
    };

    // =========================================================
    // 🔹 OBTENER ESPECIALIDADES (R) - CORREGIDO con TOKEN
    // =========================================================
    const obtenerEspecialidades = async () => {
        try {
            const res = await fetch(`${BASE_URL}/especialidad`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }, 
            });

            if (!res.ok) {
                // Asumiendo que la respuesta es un array directo.
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setEspecialidades(data);
        } catch (error) {
            console.error("Error al obtener especialidades:", error);
            setEspecialidades([]); 
        }
    };

    const handleChange = (e) => {
        setNuevoMedico({ ...nuevoMedico, [e.target.name]: e.target.value });
    };

    // =========================================================
    // 🔹 CREAR/ACTUALIZAR MÉDICO (C/U) - Solución al 400: id_usuario
    // =========================================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🚨 CRÍTICO: La creación de un médico requiere id_usuario. 
        // Si no estás creando el usuario y el médico a la vez, el 400 persistirá
        // si id_usuario es nulo o 0, y tu DB/Validación lo prohíbe.
        if (!nuevoMedico.id_usuario && !modoEdicion) {
            alert("Error: El campo ID de Usuario (id_usuario) es requerido para registrar un nuevo médico.");
            return;
        }

        let idEspecialidad = nuevoMedico.id_especialidad;
        if (nuevoMedico.nuevaEspecialidad) {
            try {
                // Paso 1: Crear Nueva Especialidad
                const res = await fetch(`${BASE_URL}/especialidad`, {
                    method: "POST",
                    headers: getAuthHeaders(), 
                    body: JSON.stringify({ nombre: nuevoMedico.nuevaEspecialidad }),
                });
                if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`); }
                
                const nueva = await res.json();
                idEspecialidad = nueva.id_especialidad || nueva.id;
                await obtenerEspecialidades();
            } catch (error) {
                console.error("Error al crear nueva especialidad:", error);
                return; 
            }
        }

        const datos = {
            id_usuario: nuevoMedico.id_usuario, // ⬅️ Incluye el id_usuario
            nombre: nuevoMedico.nombre,
            apellido: nuevoMedico.apellido,
            id_especialidad: idEspecialidad,
        };
        
        console.log("Payload enviado para POST/PUT:", datos); // Debugging del 400

        try {
            const url = modoEdicion
                ? `${BASE_URL}/medico/${idEditar}`
                : `${BASE_URL}/medico`;
            const metodo = modoEdicion ? "PUT" : "POST";

            // Paso 2: Crear/Actualizar Médico
            const res = await fetch(url, {
                method: metodo,
                headers: getAuthHeaders(), 
                body: JSON.stringify(datos),
            });
            
            if (!res.ok) { 
                const errorData = await res.json();
                console.error("Detalles del error 400:", errorData);
                alert(`Error al guardar: ${errorData.mensaje || errorData.errors[0].msg || res.statusText}`);
                throw new Error(`HTTP error! status: ${res.status}`); 
            }
            
            obtenerMedicos();
            // Resetea todos los campos, incluido id_usuario si lo usaste
            setNuevoMedico({ id_usuario: "", nombre: "", apellido: "", id_especialidad: "", nuevaEspecialidad: "" });
            setModoEdicion(false);
            setIdEditar(null);
        } catch (error) {
            console.error("Error al guardar médico:", error);
        }
    };

    const editarMedico = (medico) => {
        setNuevoMedico({
            id_usuario: medico.id_usuario || "", // Si existe, cárgalo
            nombre: medico.nombre,
            apellido: medico.apellido,
            id_especialidad: medico.id_especialidad,
            nuevaEspecialidad: "",
        });
        setModoEdicion(true);
        setIdEditar(medico.id_medico);
    };

    // =========================================================
    // 🔹 ELIMINAR MÉDICO (D)
    // =========================================================
    const eliminarMedico = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este médico?")) return;
        try {
            const res = await fetch(`${BASE_URL}/medico/${id}`, { 
                method: "DELETE",
                headers: { 'Authorization': `Bearer ${getToken()}` }, 
            });

            if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`); }

            obtenerMedicos();
        } catch (error) {
            console.error("Error al eliminar médico:", error);
        }
    };

    return (
        <div className="admin-medicos">
            <h2>Gestión de Médicos</h2>

            {/* Formulario */}
            <form onSubmit={handleSubmit}>
                {/* Campo de ID de Usuario - CRÍTICO para el POST/400 */}
                <input
                    type="number"
                    name="id_usuario"
                    placeholder="ID de Usuario Asociado (FK)"
                    value={nuevoMedico.id_usuario}
                    onChange={handleChange}
                    required
                    disabled={modoEdicion} // No se debe cambiar el id_usuario en edición
                />
                
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
                {modoEdicion && (
                    <button type="button" onClick={() => {
                        setModoEdicion(false); 
                        setIdEditar(null);
                        setNuevoMedico({ id_usuario: "", nombre: "", apellido: "", id_especialidad: "", nuevaEspecialidad: "" });
                    }}>
                        Cancelar
                    </button>
                )}
            </form>

            {/* Tabla de Médicos */}
            <table>
                <thead>
                    <tr>
                        <th>ID Usuario</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Especialidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {/* ✅ Validación Array.isArray(medicos) para evitar el TypeError */}
                    {Array.isArray(medicos) && medicos.map((medico) => ( 
                        <tr key={medico.id_medico || medico.id}>
                            <td>{medico.id_usuario || 'N/A'}</td> {/* Muestra el ID de usuario */}
                            <td>{medico.nombre}</td>
                            <td>{medico.apellido}</td>
                            <td>{medico.especialidad || "-"}</td> 
                            <td>
                                <button className="btn-edit" onClick={() => editarMedico(medico)}>
                                    Editar
                                </button>
                                <button className="btn-delete" onClick={() => eliminarMedico(medico.id_medico || medico.id)}>
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