// src/controllers/turno.controller.js

// 🔹 Importamos funciones del modelo (renombramos actualizarTurno para evitar conflicto)
import { obtenerTurnos, crearTurno, eliminarTurno, actualizarTurno as actualizarTurnoModel } from "../models/turno.models.js";



// B. router pide GET/turno y el controller hace la función obtenerTurnos() que se conecta a BD
// con SQL hace la sentencia SELECT y devuelve los datos

// C. en listarTurnos: Objetivo
//    - Admin ve todos los turnos
//    - Médico ve solo los turnos asignados a él
//    - Paciente ve solo sus turnos
export const listarTurnos = async (req, res) => {
  try {
    const { id, rol } = req.user;

    let turnos;

    if (rol === "admin") {
      // Admin ve todos los turnos
      turnos = await obtenerTurnos();
    } else if (rol === "medico") {
      // Médico ve solo sus turnos
      turnos = await obtenerTurnos({ id_medico: id });
    } else if (rol === "paciente") {
      // Paciente ve solo sus turnos
      turnos = await obtenerTurnos({ id_paciente: id });
    } else {
      return res.status(403).json({ error: "Rol no autorizado" });
    }

    res.json(turnos);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Crear un nuevo turno
export const nuevoTurno = async (req, res) => {
  try {
    const turno = await crearTurno(req.body);
    res.status(201).json(turno);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Borrar un turno por ID
export const borrarTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await eliminarTurno(id);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Actualizar un turno por ID
export const actualizarTurno = async (req, res) => {
  try {
    const { id } = req.params; // 👈 Obtengo el ID del turno a actualizar desde la URL
    const datosActualizados = req.body; // 👈 Obtengo los nuevos datos del cuerpo de la solicitud

    // 1. Llama al Model para ejecutar la sentencia SQL de actualización
    const turnoActualizado = await actualizarTurnoModel(id, datosActualizados);

    res.json({
      mensaje: "Turno actualizado exitosamente",
      turno: turnoActualizado
    });

  } catch (error) {
    console.error('Error al actualizar el turno:', error);
    res.status(500).json({ error: error.message });
  }
};
