// src/pages/ListadoTurnos.jsx
// * ver turno asignados *

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // 🔑 Para obtener el usuario logueado
import { obtenerTurnosAPI } from "../services/apiServices"; // 🔑 El puente de comunicación
import { toast } from "react-toastify";
import { format } from "date-fns"; // Ayuda a formatear fechas de forma legible
import './ListadoTurnos.css'; 


export default function ListadoTurnos() {
    
    // 1. 🎣 ESTADOS: Guardamos la lista y el estado de carga/error
    const [turnos, setTurnos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // 2. 🔑 OBTENER USUARIO: Usamos el Contexto de Autenticación
    const { usuario } = useAuth(); // Sabemos el rol y el ID del usuario actual

    // Configuración de Toast
    let confToast = { position: "top-right", autoClose: 3000, theme: "light" };

    // 3. 🚀 useEffect: La llamada a la API que se ejecuta al cargar
    useEffect(() => {
        async function fetchTurnos() {
            // Aseguramos que solo se ejecute si hay un usuario
            if (!usuario) {
                setCargando(false);
                return;
            }

            try {
                // 4. ⚙️ CONSTRUIR FILTROS BASADO EN EL ROL
                let filtros = {};
                
                if (usuario.rol === "medico") {
                    // Si soy médico, quiero ver los turnos donde yo soy el id_medico
                    filtros = { id_medico: usuario.id }; 
                } else if (usuario.rol === "paciente") {
                    // Si soy paciente, quiero ver los turnos donde yo soy el id_paciente
                    filtros = { id_paciente: usuario.id }; 
                } 
                // Nota: Si es 'admin', 'filtros' se queda vacío, y el Backend devuelve todos.

                // 5. 📞 Llamada al Servicio (incluye el token automáticamente)
                const datosTurnos = await obtenerTurnosAPI(filtros);
                
                setTurnos(datosTurnos);

            } catch (err) {
                console.error("Error al cargar los turnos:", err);
                setError("No se pudieron obtener los datos. Intente nuevamente.");
                toast.error(err.message, confToast);
                // Si el error es 401 (token expirado), podríamos redirigir al login
                // Esto lo maneja el ProtectedRoute y el Contexto
            } finally {
                setCargando(false);
            }
        }
        
        fetchTurnos();
    }, [usuario]); // Se vuelve a ejecutar si la información del usuario cambia
    
    // 6. 🖼️ RENDERIZADO CONDICIONAL
    if (cargando) {
        return <div className="cargando-pagina">Cargando tus citas...</div>;
    }

    if (error) {
        return <div className="error-pagina">{error}</div>;
    }
    
    // Título dinámico
    const titulo = usuario.rol === 'medico' 
        ? 'Tus Próximas Citas' 
        : usuario.rol === 'paciente' 
        ? 'Mis Turnos Reservados' 
        : 'Listado General de Turnos';

    // 7. 🎨 DISEÑO DE LA TABLA (Muestra la data enriquecida con los JOINs)
    return (
        <section className="seccion-turnos">
            <h1>{titulo}</h1>
            
            {turnos.length === 0 ? (
                <p>No tienes turnos agendados en este momento.</p>
            ) : (
                <table className="tabla-turnos">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Especialidad</th>
                            {/* Mostramos el médico SOLO si el usuario es PACIENTE o ADMIN */}
                            {(usuario.rol === 'paciente' || usuario.rol === 'admin') && <th>Médico</th>}
                            {/* Mostramos el paciente SOLO si el usuario es MÉDICO o ADMIN */}
                            {(usuario.rol === 'medico' || usuario.rol === 'admin') && <th>Paciente</th>}
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turnos.map((turno) => (
                            <tr key={turno.id_turno}>
                                <td>{format(new Date(turno.fecha), 'dd/MM/yyyy')}</td>
                                <td>{turno.hora.substring(0, 5)}</td>
                                <td>{turno.especialidad_nombre}</td>
                                
                                {/* Celda Médico */}
                                {(usuario.rol === 'paciente' || usuario.rol === 'admin') && 
                                    <td>{turno.nombre_medico}</td>}
                                
                                {/* Celda Paciente */}
                                {(usuario.rol === 'medico' || usuario.rol === 'admin') && 
                                    <td>{turno.nombre_paciente || 'Libre'}</td>} {/* Muestra 'Libre' si no hay paciente */}
                                
                                <td>{turno.estado}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}