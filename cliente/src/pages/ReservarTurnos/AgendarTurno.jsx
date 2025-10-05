// src/pages/ReservarTurnos/AgendarTurno.jsx

import FormularioTurno from '../../components/Turnos/FormularioTurno';
import './AgendarTurno.css'; 

const AgendarTurno = () => {
    
    // ... tu lógica de estados y funciones ...

    return (
        // El problema estaba aquí. Reescribe esto a mano.
        <div className="contenedor-agendar-turno"> 
            <h1>Sistema de Reservas Online</h1>
            <p>Por favor, complete sus datos para reservar su turno médico.</p>

            {/* 3. Coloco el FormularioTurno dentro del contenedor */}
            <FormularioTurno />

        </div>
    );
};

export default AgendarTurno;