// src/pages/Medico/MedicoPanel.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MedicoPanel.css'; 

const MedicoPanel = () => {
    const navigate = useNavigate();

    // Lógica temporal para mostrar el panel
    return (
        <div className="medico-panel-container">
            <h1>Bienvenido al Panel Médico</h1>
            <p>Aquí podrás ver y gestionar tus turnos.</p>
            
            <div className="medico-options">
                {/* Puedes añadir botones para ver turnos, gestionar perfil, etc. */}
                <button onClick={() => alert("Función de Turnos aún no implementada.")}>
                    Ver Mis Turnos
                </button>
            </div>

            {/* Este botón podría ser para cerrar sesión, por ejemplo */}
            <button 
                className="btn-logout"
                onClick={() => {
                    sessionStorage.removeItem('token');
                    // Idealmente, también actualizar el estado 'user' a null aquí
                    navigate('/signin');
                }}
            >
                Cerrar Sesión
            </button>
        </div>
    );
};

export default MedicoPanel;