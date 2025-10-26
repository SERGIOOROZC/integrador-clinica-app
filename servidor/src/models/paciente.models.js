// src/models/paciente.models.js

import db from "../config/db.js";

// 🔹 CREAR PACIENTE (Registro Inicial Mínimo)
// Esta función está corregida para solo insertar id_usuario y edad,
// asumiendo que DNI y Teléfono se completan en una ruta posterior (Completar Perfil).
export const crearPaciente = async (paciente) => {
    // Solo desestructuramos las propiedades que el controlador nos está enviando
    const { id_usuario, edad } = paciente; 
    
    const [result] = await db.query(
        // 🔑 Consulta SQL simplificada para evitar el error de campos NOT NULL (DNI, Teléfono)
        "INSERT INTO paciente (id_usuario, edad) VALUES (?, ?)",
        [id_usuario, edad]
    );
    
    return { id_paciente: result.insertId, id_usuario, edad };
};

// 🔹 OBTENER TURNOS DEL PACIENTE
export const obtenerTurnosPaciente = async (id_paciente) => {
    // Puedes mejorar esta consulta para incluir nombre del médico y especialidad
    const [rows] = await db.query(
        "SELECT * FROM turno WHERE id_paciente = ?",
        [id_paciente]
    );
    return rows;
};

// 🔹 OBTENER PACIENTE POR ID DE USUARIO (Necesario para el flujo de Completar Perfil)
export const obtenerPacientePorIdUsuario = async (id_usuario) => {
    // Esto es útil para saber si el perfil ya existe
    const [rows] = await db.query(
        "SELECT id_paciente, edad, dni, telefono, direccion FROM paciente WHERE id_usuario = ?",
        [id_usuario]
    );
    return rows[0]; // Devuelve el primer resultado (el perfil del paciente)
}