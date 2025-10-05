

import React, { useState } from 'react';
// 🔑 Importamos el contexto para obtener la identidad del paciente
import { useAuth } from '../../context/AuthContext';  
import { toast } from 'react-toastify'; 
// Asumimos que tienes una función en tu apiServices.js que hace el POST.
import { crearTurnoAPI } from '../../services/apiServices'; 

const FormularioTurno = () => {
    // 1. 🔑 Usamos el Contexto de Autenticación para saber quién es el usuario
    const { usuario } = useAuth(); 

    // 2. El estado solo guarda lo que el paciente REALMENTE selecciona o escribe.
    const [datosTurno, setDatosTurno] = useState({
        // ⚠️ Placeholder: DEBE ser una selección real, pronto lo haremos dinámico
        idMedico: '101', 
        fecha: '',
        hora: '',
        motivo: ''
    });

    const [mensaje, setMensaje] = useState('');
    // Añadimos un estado para saber si el mensaje es de éxito o error (para el CSS)
    const [esExito, setEsExito] = useState(false); 
    let confToast = { position: "top-right", autoClose: 3000, theme: "light" };

    // Función para actualizar los campos
    const manejarCambio = (e) => {
        setDatosTurno({
            ...datosTurno,
            [e.target.name]: e.target.value
        });
    };

    // Función clave: hablar con el Backend para crear el turno
    const enviarTurno = async (e) => {
        e.preventDefault(); 
        setMensaje('Agendando turno...');
        setEsExito(false); // Reiniciamos el estado de éxito
        
        // 3. 🛡️ CONSTRUCCIÓN DEL OBJETO FINAL
        const datosFinales = {
            id_paciente: usuario.id, // ¡CLAVE! ID del paciente logueado
            id_medico: datosTurno.idMedico,
            fecha: datosTurno.fecha,
            hora: datosTurno.hora,
            motivo: datosTurno.motivo,
            estado: 'Pendiente' // Estado inicial
        };

        try {
            // Llamamos a la función API
            const response = await crearTurnoAPI(datosFinales);

            setMensaje(`✅ ¡Turno agendado con éxito! ID: ${response.id}`);
            setEsExito(true); // Marcamos éxito
            toast.success("Turno reservado con éxito!", confToast);
            
            // Limpiamos el formulario
            setDatosTurno({ idMedico: '101', fecha: '', hora: '', motivo: '' });

        } catch (error) {
            // Manejo de errores
            const errorMessage = error.response?.data?.message || error.message;
            setMensaje(` ❌ Error: ${errorMessage}`);
            setEsExito(false); // Marcamos error
            toast.error(errorMessage, confToast);
            console.error('Error al enviar turno:', error);
        }
    };

    return (
        // 🎯 ÚNICO FORMULARIO: Aquí se define qué función se ejecuta al presionar "submit"
        <form onSubmit={enviarTurno}> 
            
            {/* El <div> es solo para estilos, no para la lógica de envío */}
            <div className="formulario-turno"> 
                <h2>Agendar Nuevo Turno</h2>
                
                {/* ⚠️ Campo Médico: Será un Select en el siguiente paso */}
                <div className="form-grupo">
                    <label htmlFor="idMedico">ID Médico Seleccionado (Temporal):</label>
                    <input
                        type="text"
                        name="idMedico"
                        // Asignamos el valor directamente al estado para el ejemplo
                        value={datosTurno.idMedico} 
                        onChange={manejarCambio} 
                        required
                    />
                </div>
                
                {/* Campo Fecha */}
                <div className="form-grupo">
                    <label htmlFor="fecha">Fecha:</label>
                    <input
                        type="date"
                        name="fecha"
                        value={datosTurno.fecha}
                        onChange={manejarCambio}
                        required
                    />
                </div>

                {/* Campo Hora */}
                <div className="form-grupo">
                    <label htmlFor="hora">Hora:</label>
                    <input
                        type="time"
                        name="hora"
                        value={datosTurno.hora}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                
                {/* Campo Motivo */}
                <div className="form-grupo">
                    <label htmlFor="motivo">Motivo de la consulta:</label>
                    <textarea
                        name="motivo"
                        value={datosTurno.motivo}
                        onChange={manejarCambio}
                        required
                    ></textarea>
                </div>

                {/* Botón para enviar la solicitud al servidor */}
                <button type="submit" className="btn-confirmar">Confirmar Turno</button>
            
                {/* Muestra el mensaje con una clase CSS condicional (éxito/error) */}
                {mensaje && <p className={`mensaje-feedback ${esExito ? 'exito' : 'error'}`}>{mensaje}</p>}
            </div>
        </form>
    );
};

export default FormularioTurno;