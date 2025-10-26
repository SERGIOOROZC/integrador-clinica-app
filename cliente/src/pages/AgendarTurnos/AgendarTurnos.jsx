// src/pages/AgendarTurnos/AgendarTurnos.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obtenerMedicosAPI, obtenerTurnosAPI, crearTurnoAPI } from '../../services/apiServices';
import { toast } from 'react-toastify';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './AgendarTurnos.css';

const locales = { es };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const AgendarTurnos = () => {
    const { idMedico } = useParams();
    const { user, loading } = useAuth(); 

    const [medicoInfo, setMedicoInfo] = useState({ nombre: 'Cargando...', especialidad: '' });
    const [turnosMedico, setTurnosMedico] = useState([]); 
    const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
    const [motivoConsulta, setMotivoConsulta] = useState(''); 
    const [isLoadingData, setIsLoadingData] = useState(true);

    const minHora = new Date(0, 0, 0, 9, 0, 0); 
    const maxHora = new Date(0, 0, 0, 18, 0, 0); 

    useEffect(() => {
        if (loading || !user || user.rol !== 'paciente' || user.perfil_paciente_completo === false) return;

        if (!idMedico) return;

        const cargarDatos = async () => {
            setIsLoadingData(true);
            try {
                const medicos = await obtenerMedicosAPI();
                const seleccionado = medicos.find(m => m.id.toString() === idMedico.toString());
                
                setMedicoInfo(seleccionado 
                    ? { nombre: `${seleccionado.nombre} ${seleccionado.apellido || ''}`, especialidad: seleccionado.especialidad || 'General' } 
                    : { nombre: 'Médico no encontrado', especialidad: '' }
                );

                const turnos = await obtenerTurnosAPI({ id_medico: idMedico });
                const eventos = turnos.map(t => {
                    const start = new Date(`${t.fecha}T${t.hora}`);
                    if (isNaN(start.getTime())) return null;
                    const end = new Date(start.getTime() + 30*60000);
                    return { title: 'Ocupado', start, end, isOccupied: true };
                }).filter(e => e !== null);

                setTurnosMedico(eventos);

            } catch (error) {
                console.error("Error cargar datos:", error);
                toast.error("Error al cargar datos del médico.");
            } finally {
                setIsLoadingData(false);
            }
        };

        cargarDatos();
    }, [idMedico, user, loading]);

    const handleSelectSlot = ({ start }) => {
        if (turnosMedico.some(turno => turno.start.getTime() === start.getTime())) {
            setTurnoSeleccionado(null);
            return toast.warn("Esa hora ya está reservada. Elige otro slot.");
        }
        setTurnoSeleccionado(start);
        setMotivoConsulta('');
    };

    const handleConfirmarTurno = async () => {
        if (!turnoSeleccionado) return toast.error("Selecciona una hora.");
        if (!motivoConsulta.trim()) return toast.error("Motivo obligatorio.");

        try {
            await crearTurnoAPI({
               // id_paciente: user.id_usuario, 
                id_medico: idMedico,
                fecha: format(turnoSeleccionado, 'yyyy-MM-dd'),
                hora: format(turnoSeleccionado, 'HH:mm'),
                motivo: motivoConsulta,
                estado: 'Pendiente',
            });
            toast.success('Turno confirmado!');
            setTurnoSeleccionado(null); 
            setMotivoConsulta('');
        } catch (error) {
            console.error(error);
            toast.error('Error al confirmar turno.');
        }
    };

    const eventPropGetter = (event) => event.isOccupied ? 
        { style: { backgroundColor: '#dc2626', color: '#fff', borderRadius: '0px', border: 'none' } } : {};

    if (loading) return <div>Cargando sesión...</div>;
    if (!user || user.rol !== 'paciente' || user.perfil_paciente_completo === false) return null;
    if (isLoadingData) return <div>Cargando turnos y datos del médico...</div>;

    return (
        <div className="contenedor-agendar-turno">
            <h1>Agendar Turno</h1>
            <p>Médico: <strong>{medicoInfo.nombre}</strong> - Especialidad: {medicoInfo.especialidad}</p>

            <Calendar
                localizer={localizer}
                events={turnosMedico}
                startAccessor="start"
                endAccessor="end"
                selectable
                onSelectSlot={handleSelectSlot}
                eventPropGetter={eventPropGetter}
                min={minHora} 
                max={maxHora} 
                step={30}
                timeslots={1}
                views={['week', 'day', 'agenda']} 
                defaultView="week"
                style={{ height: 500, margin: '20px 0' }}
            />

            {turnoSeleccionado && (
                <div className="reserva-confirmacion-panel">
                    <h3>Confirmar Reserva</h3>
                    <p>Turno seleccionado: <strong>{turnoSeleccionado.toLocaleString(locales.es)}</strong></p>
                    
                    <div className="motivo-input-container">
                        <label htmlFor="motivo">Motivo de la consulta:</label>
                        <textarea
                            id="motivo"
                            value={motivoConsulta}
                            onChange={e => setMotivoConsulta(e.target.value)}
                            rows="3"
                            required
                            placeholder="Ej. Control anual, dolor de cabeza, etc."
                        />
                    </div>
                    
                    <button className="btn-confirmar" onClick={handleConfirmarTurno}>
                        CONFIRMAR RESERVA
                    </button>
                </div>
            )}
        </div>
    );
};

export default AgendarTurnos;
