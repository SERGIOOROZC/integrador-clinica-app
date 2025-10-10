// src/models/medico.models.js

import db from "../config/db.js";

// ==========================================================
// 1. OBTENER TODOS LOS MÉDICOS CON SU ESPECIALIDAD (JOIN)
// ==========================================================
export const obtenerTodosLosMedicos = async () => {
    // La consulta usa INNER JOIN para enlazar medico con especialidad
    // y alias para asegurar que el frontend reciba 'id' y 'especialidad'.
    const [rows] = await db.query(
        `SELECT 
            m.id_medico AS id,         -- Alias 'id' para que el frontend lo use en la URL
            m.nombre, 
            m.apellido, 
            e.nombre AS especialidad   -- Alias 'especialidad' para el nombre legible
         FROM medico m
         INNER JOIN especialidad e ON m.id_especialidad = e.id_especialidad
         ORDER BY m.apellido ASC`
    );
    return rows;
};

// ==========================================================
// 2. CREAR MÉDICO
// ==========================================================
export const crearMedico = async (medico) => {
    const { id_usuario, nombre, apellido, id_especialidad } = medico;
    const [result] = await db.query(
        "INSERT INTO medico (id_usuario, nombre, apellido, id_especialidad) VALUES (?, ?, ?, ?)",
        [id_usuario, nombre, apellido, id_especialidad]
    );
    // Nota: Devolvemos el ID insertado como 'id' para ser consistentes.
    return { id: result.insertId, ...medico };
};

// ==========================================================
// 3. OBTENER TURNOS POR MÉDICO
// ==========================================================
export const obtenerTurnosMedico = async (id_medico) => {
    // Si necesitas el nombre del paciente y la hora, necesitarías un JOIN aquí también.
    const [rows] = await db.query(
        "SELECT * FROM turno WHERE id_medico = ?",
        [id_medico]
    );
    return rows;
};