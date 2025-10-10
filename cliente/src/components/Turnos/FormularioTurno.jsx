import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';  
import { toast } from 'react-toastify'; 
import { crearTurnoAPI, obtenerMedicosAPI } from '../../services/apiServices'; 
import { useNavigate } from 'react-router-dom'; 

// 🔑 Importamos los estilos para el formulario
import './FormularioTurno.css'; 

// 🔑 CLAVE: Recibimos idMedico como una propiedad
const FormularioTurno = ({ idMedico }) => { 
    // 1. Contexto y Navegación
    const { usuario } = useAuth();
    const navigate = useNavigate();

    // 2. Estado para los datos del formulario
    const [datosTurno, setDatosTurno] = useState({
        fecha: '',
        hora: '',
        motivo: ''
    });
    
    // 3. Estado para la info del médico seleccionado
    const [medicoInfo, setMedicoInfo] = useState({ nombre: 'Cargando...', especialidad: '' });
    const [mensaje, setMensaje] = useState('');
    const [esExito, setEsExito] = useState(false); 
    const confToast = { position: "top-right", autoClose: 3000, theme: "light" };

    // 💡 Efecto para cargar el nombre del médico usando el idMedico
    useEffect(() => {
        // Se ejecuta solo si se recibe un ID válido
        if (!idMedico) return;

        const cargarInfoMedico = async () => {
            try {
                const medicos = await obtenerMedicosAPI();
                
                // ✅ CORRECCIÓN 1: Buscar por m.id (el alias de la DB)
                // Usamos .toString() para asegurar la comparación, ya que idMedico viene de la URL (string)
                const seleccionado = medicos.find(m => m.id.toString() === idMedico.toString());

                if (seleccionado) {
                    setMedicoInfo({
                        nombre: `${seleccionado.nombre} ${seleccionado.apellido}`,
                        // ✅ CORRECCIÓN 2: Usar 'especialidad' (el alias de la DB)
                        especialidad: seleccionado.especialidad || 'Especialista'
                    });
                } else {
                    setMedicoInfo({ nombre: 'Médico no encontrado', especialidad: '' });
                }
            } catch (error) {
                console.error("Error al cargar info del médico:", error);
                setMedicoInfo({ nombre: 'Error al cargar médico', especialidad: '' });
            }
        };

        cargarInfoMedico();
    }, [idMedico]); 

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
        setEsExito(false);
        
        // 🛡️ CONSTRUCCIÓN DEL OBJETO FINAL
        const datosFinales = {
            id_paciente: usuario.id,    // ID del paciente logueado (desde AuthContext)
            id_medico: idMedico,        // ID del médico seleccionado (desde la URL)
            fecha: datosTurno.fecha,
            hora: datosTurno.hora,
            motivo: datosTurno.motivo,
            estado: 'Pendiente'         // Estado inicial
        };

        try {
            await crearTurnoAPI(datosFinales);

            toast.success("Turno reservado con éxito!", confToast);
            // Redirigir a la página de turnos reservados
            navigate('/misturnos'); 

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Error de conexión con el servidor.";
            setMensaje(` ❌ Error: ${errorMessage}`);
            setEsExito(false);
            toast.error(errorMessage, confToast);
        }
    };

    return (
        <div className="formulario-turno-container">
            <form onSubmit={enviarTurno}> 
                <div className="formulario-turno"> 
                    <h2>Agendar Nuevo Turno</h2>
                    
                    {/* 🎯 MUESTRA EL MÉDICO SELECCIONADO */}
                    <p className="medico-seleccionado-info">
                        Reservando con: <strong>{medicoInfo.nombre}</strong> de {medicoInfo.especialidad}
                    </p>
                    
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

                    <button type="submit" className="btn-confirmar">Confirmar Turno</button>
                
                    {mensaje && <p className={`mensaje-feedback ${esExito ? 'exito' : 'error'}`}>{mensaje}</p>}
                </div>
            </form>
        </div>
    );
};

export default FormularioTurno;