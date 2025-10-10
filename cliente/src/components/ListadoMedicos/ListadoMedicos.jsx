// src/components/ListadoMedicos/ListadoMedicos.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerMedicosAPI } from '../../services/apiServices'; 

// ✅ ÚNICA IMPORTACIÓN DE MEDIOCARD (Ajustada para que funcione desde '../MedicoCard/MedicoCard.jsx')
import MedicoCard from '../MedicoCard/MedicoCard.jsx'; 

// 🔑 Importamos los estilos para la sección y las tarjetas
import './ListadoMedicos.css'; 

const ListadoMedicos = () => {
    const [medicos, setMedicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarMedicos = async () => {
            try {
                const data = await obtenerMedicosAPI(); 
                setMedicos(data);
                setError(null);
            } catch (err) {
                setError("Error al cargar médicos: " + err.message);
                console.error("Error en ListadoMedicos:", err);
            } finally {
                setLoading(false);
            }
        };
        cargarMedicos();
    }, []); 

    const handleSelectMedico = (idMedico) => {
        navigate(`/agendar/${idMedico}`); 
    };

    if (loading) {
        return <div className="loading-container"><p>Cargando la lista de médicos...</p></div>;
    }

    if (error) {
        return <div className="error-container"><p>🛑 {error}</p></div>;
    }

    return (
        <section className="listado-medicos-section">
            <div className="blurred-shape-container"></div> 
            
            <h1>Selecciona un Médico</h1>
            <p>Por favor, elige un especialista para continuar con la reserva.</p>
            
            <div className="medicos-grid">
                {medicos.length === 0 ? (
                    <p>No hay médicos registrados en el sistema. Vuelve más tarde.</p>
                ) : (
                    medicos.map(medico => (
                        <MedicoCard 
                            key={medico.id}
                            medico={medico} 
                            onSelect={handleSelectMedico} 
                        />
                    ))
                )}
            </div>
        </section>
    );
};

export default ListadoMedicos;