// src/components/ListadoMedicos/ListadoMedicos.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { obtenerMedicosAPI } from '../../services/apiServices'; 
import MedicoCard from '../MedicoCard/MedicoCard.jsx'; 
import './ListadoMedicos.css';

const ListadoMedicos = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    // 💾 Estados para la información
    const [medicos, setMedicos] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);

    // 🔹 Redirección inmediata según rol/perfil
    useEffect(() => {
        if (!loading) {
            if (!user || user.rol !== 'paciente') {
                toast.warn("Acceso denegado. Debes ser un paciente logueado.");
                navigate('/signin', { replace: true });
            } else if (user.perfil_paciente_completo === false) {
                toast.info("Por favor, completa tu perfil antes de reservar turnos.");
                navigate('/completar-perfil', { replace: true });
            }
        }
    }, [loading, user, navigate]);

    // 🔹 Carga de médicos
    useEffect(() => {
        if (loading || !user || user.rol !== 'paciente' || user.perfil_paciente_completo === false) return;

        const cargarMedicos = async () => {
            setLoadingData(true);
            setError(null);
            try {
                const data = await obtenerMedicosAPI();
                if (!Array.isArray(data)) {
                    console.warn("La API no devolvió un array. Forzando lista vacía.");
                    setMedicos([]);
                } else {
                    setMedicos(data);
                    if (data.length > 0) toast.success(`Éxito: ${data.length} médicos cargados.`);
                    else toast.info("Aún no hay médicos registrados en el sistema.");
                }
            } catch (err) {
                const mensajeError = err.message || "Error de red o servidor.";
                setError(mensajeError);
                toast.error(`Error de carga: ${mensajeError}`);
                console.error("Error en ListadoMedicos:", err);
            } finally {
                setLoadingData(false);
            }
        };

        cargarMedicos();
    }, [loading, user]);

    const handleSelectMedico = (idMedico) => navigate(`/agendar/${idMedico}`);

    // 🛑 Renderizado condicional

    if (loading || loadingData) return (
        <div className="listado-medicos-estado loading">
            <h2>Cargando médicos... ⏳</h2>
        </div>
    );

    if (!loading && user?.rol === 'paciente' && user.perfil_paciente_completo === false) {
        return (
            <div className="listado-medicos-estado loading">
                <h2>Redirigiendo a completar perfil...</h2>
            </div>
        );
    }

    if (error) return (
        <div className="listado-medicos-estado error">
            <h2>❌ Error al cargar los médicos</h2>
            <p>Por favor, verifica el backend y que el token sea válido.</p>
            <p>Detalle: {error}</p>
        </div>
    );

    // 🛑 Renderizado principal
    return (
        <section className="listado-medicos-section">
            <div className="blurred-shape-container"></div>
            
            <h1>Selecciona un Médico</h1>
            <p>Por favor, elige un especialista para continuar con la reserva.</p>
            
            <div className="medicos-grid">
                {medicos.length === 0 ? (
                    <div className="listado-medicos-estado no-data">
                        <p>ℹ️ Lo sentimos, no hay médicos registrados. Vuelve más tarde.</p>
                    </div>
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
