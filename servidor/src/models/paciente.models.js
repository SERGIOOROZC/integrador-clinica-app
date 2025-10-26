// src/models/paciente.models.js

import db from "../config/db.js";

/**
 * Crear un paciente.
 * id_responsable y direccion son opcionales, por defecto null
 */
export const crearPaciente = async ({
    id_usuario,
    dni,
    telefono,
    edad,
    id_responsable = null,
    direccion = null
}) => {
    const [result] = await db.query(
        `INSERT INTO paciente 
          (id_usuario, dni, telefono, edad, id_responsable, direccion)
         VALUES (?, ?, ?, ?, ?, ?)`,
        // 🚨 CORRECCIÓN CRÍTICA: Se pasan las variables directamente.
        // Esto evita que '0' (falsy) se convierta en 'null'.
        [id_usuario, dni, telefono, edad, id_responsable, direccion] 
    );

    return {
        id_paciente: result.insertId,
        id_usuario,
        dni,
        telefono,
        edad,
        id_responsable,
        direccion
    };
};

/**
 * Actualizar paciente existente
 */
export const actualizarPaciente = async ({
    id_paciente,
    dni,
    telefono,
    edad,
    id_responsable = null,
    direccion = null
}) => {
    await db.query(
        `UPDATE paciente 
            SET dni = ?, telefono = ?, edad = ?, id_responsable = ?, direccion = ?
          WHERE id_paciente = ?`,
        // Se pasan las variables directamente para la actualización también
        [dni, telefono, edad, id_responsable, direccion, id_paciente] 
    );

    return { id_paciente, dni, telefono, edad, id_responsable, direccion };
};

/**
 * Obtener paciente por id_usuario
 */
export const obtenerPacientePorUsuario = async (id_usuario) => {
    const [rows] = await db.query(
        `SELECT id_paciente, id_usuario, dni, telefono, edad, id_responsable, direccion
          FROM paciente
          WHERE id_usuario = ?`,
        [id_usuario]
    );
    return rows[0] || null;
};