// src/controllers/medico.controller.js

// 🔑 Importamos todas las funciones del modelo, incluida la nueva para listar
import { 
    crearMedico, 
    obtenerTurnosMedico, 
    obtenerTodosLosMedicos // ⬅️ ¡Esta es la clave!
} from "../models/medico.models.js"; 


// ==========================================================
// 1. NUEVO: Listar todos los médicos (GET /api/medico)
// ==========================================================
export const listarMedicos = async (req, res) => {
    try {
        // Llama a la función del modelo para obtener todos los registros de la DB
        const medicos = await obtenerTodosLosMedicos(); 

        if (!medicos || medicos.length === 0) {
            // Si la lista está vacía
            return res.status(404).json({ mensaje: "No se encontraron médicos disponibles." });
        }

        // Éxito: Envía la lista al frontend (ReservarTurno.jsx)
        res.json({
            mensaje: "Lista de médicos obtenida correctamente.",
            medicos: medicos // Enviamos el array
        });

    } catch (error) {
        console.error("Error en listarMedicos:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener la lista de médicos." });
    }
};


// ==========================================================
// 2. Existente: Registrar médico (POST /api/medico)
// ==========================================================
export const registrarMedico = async (req, res) => {
    try {
        const medico = await crearMedico(req.body);
        res.status(201).json(medico);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==========================================================
// 3. Existente: Ver turnos de un médico (GET /api/medico/:id/turnos)
// ==========================================================
export const verTurnosMedico = async (req, res) => {
    try {
        const { id } = req.params;
        const turnos = await obtenerTurnosMedico(id);
        res.json(turnos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};