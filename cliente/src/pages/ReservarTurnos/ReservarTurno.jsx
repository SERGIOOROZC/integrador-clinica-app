// src/pages/ReservarTurnos/ReservarTurno.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerMedicosAPI } from '../../services/apiServices'; 
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext'; 
import './ReservarTurno.css'; 

export default function ReservarTurno() {
    const [medicos, setMedicos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();
    const { usuario } = useAuth(); // Para mostrar quién está logueado

    useEffect(() => {
        const cargarMedicos = async () => {
            try {
                // Llama a la API para obtener la lista de médicos
                const listaMedicos = await obtenerMedicosAPI(); 
                setMedicos(listaMedicos);
            } catch (err) {
                toast.error("No se pudo obtener el listado de médicos.");
                console.error(err);
            } finally {
                setCargando(false);
            }
        };
        cargarMedicos();
    }, []);

    const seleccionarMedico = (idMedico) => {
        // 🔑 CLAVE: Redirigir a la página AgendarTurno, pasando el ID del médico en la URL
        navigate(`/agendar/${idMedico}`); 
    };

    if (cargando) {
        return <div className="cargando-pagina">Cargando médicos...</div>;
    }

    return (
        <div className="pagina-reserva-medicos">
            <h1>Bienvenido, {usuario.nombre}!</h1>
            <h2>Selecciona un Médico para Agendar tu Cita</h2>
            
            {medicos.length === 0 ? (
                <p>No hay médicos disponibles para reserva.</p>
            ) : (
                <div className="lista-medicos-grid">
                    {medicos.map((medico) => (
                        <div key={medico.id_medico} className="medico-card">
                            <h3>Dr(a). {medico.nombre} {medico.apellido}</h3>
                            <p>Especialidad: {medico.especialidad_nombre || 'General'}</p>
                            <button 
                                onClick={() => seleccionarMedico(medico.id_medico)}
                            >
                                Reservar Turno
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}