import { crearPaciente, obtenerTurnosPaciente } from "../models/paciente.models.js";

export const registrarPaciente = async (req, res) => {
  try {
    const paciente = await crearPaciente(req.body);
    res.status(201).json(paciente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verTurnosPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const turnos = await obtenerTurnosPaciente(id);
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
