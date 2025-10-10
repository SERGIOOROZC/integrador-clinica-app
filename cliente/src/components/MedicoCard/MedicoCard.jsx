// src/components/Doctors/MedicoCard.jsx

import React from 'react';
// Asume que el CSS ya está importado en ListadoMedicos.jsx
// import './ListadoMedicos.css'; 

// Función auxiliar para obtener una imagen de perfil temporal (si no tienes una DB de fotos)
const getAvatarUrl = (nombre) => {
    // Puedes usar servicios como DiceBear, Gravatar o generar uno simple
    // Esto es solo un placeholder:
    return `https://ui-avatars.com/api/?name=${nombre.replace(' ', '+')}&background=4f46e5&color=fff&bold=true`;
};

const MedicoCard = ({ medico, onSelect }) => {
    // URL de la foto: Si tienes una URL real en medico.fotoUrl, úsala.
    const fotoUrl = medico.fotoUrl || getAvatarUrl(medico.nombre + ' ' + medico.apellido);

    return (
        <div 
            key={medico.id} 
            className="medico-card" 
            onClick={() => onSelect(medico.id)}
        >
            <div className="medico-avatar-container">
                <img 
                    src={fotoUrl} 
                    alt={`Foto de ${medico.nombre} ${medico.apellido}`} 
                    className="medico-avatar" 
                />
            </div>
            
            <div className="medico-info">
                <h3 className="medico-nombre">{medico.nombre} {medico.apellido}</h3>
                <p className="medico-especialidad-label">Especialidad:</p>
                <p className="medico-especialidad-valor">
                    <strong>{medico.especialidad}</strong>
                </p>
            </div>
            
            <button className="btn-select">
                Seleccionar y Agendar
            </button>
        </div>
    );
};

export default MedicoCard;