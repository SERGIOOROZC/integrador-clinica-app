// src/components/CompletarPerfil/CompletarPerfil.jsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./CompletarPerfil.css";

const API_BASE_URL = "http://localhost:3000";

const CompletarPerfil = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [datosPerfil, setDatosPerfil] = useState({
        dni: "",
        telefono: "",
        edad: "",
    });

    const [loading, setLoading] = useState(false);

    // -----------------------------------------------------------
    // Redirección si no hay usuario logueado
    // -----------------------------------------------------------
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    // -----------------------------------------------------------
    // Manejo de cambios en el formulario
    // -----------------------------------------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatosPerfil({ ...datosPerfil, [name]: value });
    };

    // -----------------------------------------------------------
    // Manejo del envío del formulario
    // -----------------------------------------------------------
    const handleCompletarPerfil = async (e) => {
        e.preventDefault();
        setLoading(true);

        const idUsuario = user?.id_usuario;

        if (!idUsuario) {
            toast.error("Error de sesión: ID de usuario no encontrado.");
            setLoading(false);
            return;
        }

        if (!datosPerfil.dni.trim() || !datosPerfil.telefono.trim() || !datosPerfil.edad) {
            toast.error("Por favor, completa todos los campos requeridos.");
            setLoading(false);
            return;
        }

        // Se mantiene la estructura de datosAEnviar, pero ya no la usamos para POST, 
        // solo para el cuerpo del PUT. Se elimina 'id_usuario' del body.
        const datosAEnviar = {
            dni: datosPerfil.dni,
            telefono: datosPerfil.telefono,
            edad: datosPerfil.edad,
            id_responsable: null, // valor por defecto (se mantienen)
            direccion: null,      // valor por defecto (se mantienen)
        };

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Token no encontrado, inicia sesión nuevamente.");
                setLoading(false);
                return;
            }

            // 🚨 CORRECCIÓN CRÍTICA 🚨
            // 1. Cambiar el método de POST a PUT.
            // 2. Agregar el ID del usuario a la URL para que el BackEnd sepa qué perfil actualizar.
            const res = await fetch(`${API_BASE_URL}/paciente/${idUsuario}`, {
                method: "PUT", // 👈 CAMBIO CLAVE: Actualización (Update)
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(datosAEnviar),
            });

            const responseData = await res.json();

            if (!res.ok) {
                console.error("Error backend:", responseData);
                toast.error(responseData.error || "No se pudo guardar el perfil.");
                return;
            }

            toast.success(responseData.mensaje || "Perfil completado con éxito.");
            navigate("/reservar"); // Redirige al flujo siguiente (reserva de turno)

        } catch (error) {
            console.error("Error de conexión:", error);
            toast.error("Hubo un error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------------------------------------
    // Renderizado (se mantiene)
    // -----------------------------------------------------------
    if (!user) {
        return (
            <div className="completar-perfil-container">
                <h2>Cargando sesión...</h2>
                <p>
                    Si esto tarda, ve a{" "}
                    <a
                        href="/login"
                        onClick={(e) => {
                            e.preventDefault();
                            logout();
                            navigate("/login");
                        }}
                    >
                        Login
                    </a>
                    .
                </p>
            </div>
        );
    }

    return (
        <div className="completar-perfil-container">
            <h2>Completar Perfil de Paciente</h2>
            <p>Datos de la cuenta: {user.nombre} {user.apellido}</p>
            <form onSubmit={handleCompletarPerfil}>
                {/* DNI */}
                <label htmlFor="dni">DNI</label>
                <input
                    type="text"
                    name="dni"
                    id="dni"
                    value={datosPerfil.dni}
                    onChange={handleChange}
                    placeholder="Número de identificación"
                    required
                />

                {/* Teléfono */}
                <label htmlFor="telefono">Teléfono</label>
                <input
                    type="tel"
                    name="telefono"
                    id="telefono"
                    value={datosPerfil.telefono}
                    onChange={handleChange}
                    placeholder="Ej: 3415550000"
                    required
                />

                {/* Edad */}
                <label htmlFor="edad">Edad</label>
                <input
                    type="number"
                    name="edad"
                    id="edad"
                    value={datosPerfil.edad}
                    onChange={handleChange}
                    placeholder="Tu edad en años"
                    required
                    min="1"
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Completar y Continuar"}
                </button>
            </form>
        </div>
    );
};

export default CompletarPerfil;