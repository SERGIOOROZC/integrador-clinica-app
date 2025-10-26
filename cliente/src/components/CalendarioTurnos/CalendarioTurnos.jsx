// src/components/CalendarioTurnos/CalendarioTurnos.jsx
import React, { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addMinutes } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import './CalendarioTurnos.css';

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarioTurnos = ({ medico, turnosOcupados = [], onSeleccionarTurno }) => {
  const [seleccion, setSeleccion] = useState(null);

  // Convertir turnos ocupados a eventos para react-big-calendar
  const eventos = useMemo(() => {
    return turnosOcupados.map((t) => {
      const start = new Date(`${t.fecha}T${t.hora}`);
      const end = addMinutes(start, 30); // Asumimos turnos de 30 min
      return { title: "Ocupado", start, end };
    });
  }, [turnosOcupados]);

  // Crear "slots" disponibles para seleccionar
  const handleSelectSlot = ({ start, end }) => {
    // Verificar que el slot no esté ocupado
    const ocupado = eventos.some(
      (e) => start < e.end && end > e.start
    );
    if (ocupado) return; // no permite seleccionar slots ocupados

    setSeleccion(start);
    if (onSeleccionarTurno)
      onSeleccionarTurno({ fecha: start.toISOString().slice(0, 10), hora: start.toTimeString().slice(0,5) });
  };

  return (
    <div className="calendario-turnos-container">
      <h3>Calendario de {medico.nombre} ({medico.especialidad})</h3>

      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        views={['week', 'day']} // Puedes ajustar: month, week, day
        defaultView="week"
        min={new Date(new Date().setHours(8,0,0))} // Inicio de jornada
        max={new Date(new Date().setHours(18,0,0))} // Fin de jornada
      />

      {seleccion && (
        <p className="turno-seleccionado">
          Turno seleccionado: {seleccion.toLocaleDateString()} {seleccion.toTimeString().slice(0,5)}
        </p>
      )}
    </div>
  );
};

export default CalendarioTurnos;
