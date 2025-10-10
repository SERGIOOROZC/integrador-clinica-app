// cliente/src/pages/AgendarTurnos/AgendarTurnos.jsx

import React from 'react'; 
import { useParams } from 'react-router-dom'; // 🔑 Importamos para leer el ID de la URL
import FormularioTurno from '../../components/Turnos/FormularioTurno'; 
import './AgendarTurnos.css'; // Asegúrate de que este archivo CSS exista o ajusta el nombre

const AgendarTurnos = () => {
    
    // 1. 🎣 Extraer el ID del médico de la URL
    // Esto asume que tu ruta es: path="/agendar/:idMedico"
    const { idMedico } = useParams(); 
    
    // Si el ID no se pudo extraer (por si la URL está mal)
    if (!idMedico) {
        return (
            <div className="error-reserva">
                ⚠️ Error: ID de médico no encontrado. Por favor, selecciona un médico del listado.
            </div>
        );
    }

    return (
        <div className="contenedor-agendar-turno"> 
            
            <h1>Confirmar Reserva de Turno</h1>
            <p className="instrucciones">
                Estás a un paso de confirmar tu cita. Médico ID: 
                <strong> {idMedico}</strong>. Completa los campos restantes.
            </p>

            {/* 2. 🔑 CLAVE: Pasamos el ID del médico como propiedad al FormularioTurno */}
            <FormularioTurno idMedico={idMedico} />

        </div>
    );
};

export default AgendarTurnos;