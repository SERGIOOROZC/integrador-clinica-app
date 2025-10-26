// src/models/especialidad.models.js

import db from "../config/db.js";

// ==========================================================
// 1. LISTAR ESPECIALIDADES (SELECT *)
// ==========================================================
export const listarEspecialidadesModel = async () => {
    try {
        const [rows] = await db.query(
            "SELECT id_especialidad, nombre FROM especialidad ORDER BY nombre ASC"
        );
        return rows;
    } catch (error) {
        console.error("Error en listarEspecialidadesModel:", error);
        throw error;
    }
};

// ==========================================================
// 2. CREAR ESPECIALIDAD (INSERT)
// ==========================================================
export const crearEspecialidadModel = async ({ nombre }) => {
    try {
        const [result] = await db.query(
            "INSERT INTO especialidad (nombre) VALUES (?)",
            [nombre]
        );
        return { id_especialidad: result.insertId, nombre };
    } catch (error) {
        console.error("Error en crearEspecialidadModel:", error);
        throw error;
    }
};

// ==========================================================
// 3. ACTUALIZAR ESPECIALIDAD (UPDATE)
// ==========================================================
export const actualizarEspecialidadModel = async (id, { nombre }) => {
    try {
        const [result] = await db.query(
            "UPDATE especialidad SET nombre = COALESCE(?, nombre) WHERE id_especialidad = ?",
            [nombre, id]
        );
        return result; // Contiene affectedRows
    } catch (error) {
        console.error("Error en actualizarEspecialidadModel:", error);
        throw error;
    }
};

// ==========================================================
// 4. ELIMINAR ESPECIALIDAD (DELETE)
// ==========================================================
export const eliminarEspecialidadModel = async (id) => {
    try {
        const [result] = await db.query(
            "DELETE FROM especialidad WHERE id_especialidad = ?",
            [id]
        );
        return result; // Contiene affectedRows
    } catch (error) {
        console.error("Error en eliminarEspecialidadModel:", error);
        throw error;
    }
};
