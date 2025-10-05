import { crearMedico, obtenerTurnosMedico } from "../models/medico.models.js";

export const registrarMedico = async (req, res) => {
  try {
    const medico = await crearMedico(req.body);
    res.status(201).json(medico);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verTurnosMedico = async (req, res) => {
  try {
    const { id } = req.params;
    const turnos = await obtenerTurnosMedico(id);
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
