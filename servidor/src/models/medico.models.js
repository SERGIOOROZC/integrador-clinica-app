// src/models/medico.models.js

import db from "../config/db.js";


// ==========================================================
// 1️⃣ OBTENER TODOS LOS MÉDICOS CON SU ESPECIALIDAD (JOIN)
// ==========================================================
// - Devuelve todos los médicos registrados con el nombre de su especialidad.
// - Usado por pacientes (para reservar) y admin (para gestionar).
export const obtenerTodosLosMedicos = async () => {
    const [rows] = await db.query(
        `SELECT 
            m.id_medico AS id,          -- Alias 'id' para el frontend
            m.nombre, 
            m.apellido, 
            e.nombre AS especialidad    -- Nombre legible de la especialidad
         FROM medico m
         INNER JOIN especialidad e 
            ON m.id_especialidad = e.id_especialidad
         ORDER BY m.apellido ASC`
    );
    return rows;
};


// ==========================================================
// 2️⃣ CREAR MÉDICO
// ==========================================================
// - Inserta un nuevo médico asociado a un usuario y una especialidad.
// - Retorna el nuevo registro creado.
export const crearMedico = async (medico) => {
    const { id_usuario, nombre, apellido, id_especialidad } = medico;

    const [result] = await db.query(
        `INSERT INTO medico (id_usuario, nombre, apellido, id_especialidad)
         VALUES (?, ?, ?, ?)`,
        [id_usuario, nombre, apellido, id_especialidad]
    );

    // Retorna el objeto recién creado con su nuevo ID.
    return { id: result.insertId, ...medico };
};


// ==========================================================
// 3️⃣ ACTUALIZAR DATOS DE UN MÉDICO EXISTENTE
// ==========================================================
// - Actualiza solo los campos enviados (usa COALESCE para no sobrescribir con NULL).
// - Retorna el resultado del query (affectedRows, etc.).
export const actualizarMedicoDB = async (id_medico, cambios) => {
    const { nombre, apellido, id_especialidad } = cambios;

    // COALESCE usa el valor nuevo si existe, o mantiene el actual si viene null/undefined.
    const [result] = await db.query(
        `UPDATE medico 
         SET 
            nombre = COALESCE(?, nombre),
            apellido = COALESCE(?, apellido),
            id_especialidad = COALESCE(?, id_especialidad)
         WHERE id_medico = ?`,
        [nombre, apellido, id_especialidad, id_medico]
    );

    return result;
};


// ==========================================================
// 4️⃣ ELIMINAR UN MÉDICO
// ==========================================================
// - Elimina al médico según su ID.
// - Se recomienda eliminar o reasignar sus turnos antes (por integridad referencial).
export const eliminarMedicoDB = async (id_medico) => {
    const [result] = await db.query(
        `DELETE FROM medico WHERE id_medico = ?`,
        [id_medico]
    );

    return result;
};


// ==========================================================
// 5️⃣ OBTENER TURNOS POR MÉDICO (JOIN CON PACIENTE)
// ==========================================================
// - Devuelve los turnos del médico, mostrando nombre y apellido del paciente.
// - Ideal para vista del médico o del admin.
export const obtenerTurnosMedico = async (id_medico) => {
    const [rows] = await db.query(
        `SELECT 
            t.id_turno,
            t.fecha,
            t.hora,
            t.estado,
            p.id_paciente,
            p.nombre AS paciente_nombre,
            p.apellido AS paciente_apellido
         FROM turno t
         INNER JOIN paciente p ON t.id_paciente = p.id_paciente
         WHERE t.id_medico = ?
         ORDER BY t.fecha, t.hora`,
        [id_medico]
    );

    return rows;
};
