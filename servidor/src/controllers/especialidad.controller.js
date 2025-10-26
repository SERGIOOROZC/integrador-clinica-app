// src/controllers/especialidad.controller.js

import { 
    listarEspecialidadesModel,  // Modelo para listar especialidades
    crearEspecialidadModel,     // Modelo para crear
    actualizarEspecialidadModel,// Modelo para actualizar
    eliminarEspecialidadModel   // Modelo para eliminar
} from "../models/especialidad.models.js";

// ==========================================================
// 1. LISTAR ESPECIALIDADES (GET /especialidad)
// ==========================================================
export const listarEspecialidades = async (req, res) => {
    try {
        const especialidades = await listarEspecialidadesModel();
        res.json(especialidades);
    } catch (error) {
        console.error("Error al listar especialidades:", error);
        res.status(500).json({ error: "Error al obtener las especialidades" });
    }
};

// ==========================================================
// 2. CREAR ESPECIALIDAD (POST /especialidad)
// ==========================================================
export const crearEspecialidad = async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!nombre) return res.status(400).json({ error: "Debe indicar el nombre de la especialidad" });

        const nuevaEspecialidad = await crearEspecialidadModel({ nombre });
        res.status(201).json({ mensaje: "Especialidad creada correctamente", especialidad: nuevaEspecialidad });
    } catch (error) {
        console.error("Error al crear especialidad:", error);
        res.status(500).json({ error: "Error al crear la especialidad" });
    }
};

// ==========================================================
// 3. ACTUALIZAR ESPECIALIDAD (PUT /especialidad/:id)
// ==========================================================
export const actualizarEspecialidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        const resultado = await actualizarEspecialidadModel(id, { nombre });

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Especialidad no encontrada" });
        }

        res.json({ mensaje: "Especialidad actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar especialidad:", error);
        res.status(500).json({ error: "Error al actualizar la especialidad" });
    }
};

// ==========================================================
// 4. ELIMINAR ESPECIALIDAD (DELETE /especialidad/:id)
// ==========================================================
export const eliminarEspecialidad = async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await eliminarEspecialidadModel(id);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Especialidad no encontrada para eliminar" });
        }

        res.json({ mensaje: "Especialidad eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar especialidad:", error);
        res.status(500).json({ error: "Error al eliminar la especialidad" });
    }
};
