// src/controllers/paciente.controller.js (VERSIÓN CORREGIDA Y LIMPIA)

import db from "../config/db.js";
import { crearPaciente, actualizarPaciente, obtenerPacientePorUsuario } from "../models/paciente.models.js";

/**
 * Actualiza el registro de paciente.
 * Está función ahora es llamada por la ruta PUT /paciente/:id.
 */
export const crearOActualizarPaciente = async (req, res) => {
    try {
        // 🚨 CAMBIO CLAVE: Obtener el ID del usuario desde los parámetros de la URL
        const id_usuario = req.params.id; 
        const { dni, telefono, edad } = req.body;

        if (!id_usuario || !dni || !telefono || !edad) {
            return res.status(400).json({
                error: "Faltan datos obligatorios para actualizar el perfil (ID usuario, DNI, teléfono o edad)."
            });
        }

        // 1. Buscar el perfil existente.
        const existing = await obtenerPacientePorUsuario(id_usuario);

        if (existing) {
            // 2. ACTUALIZAR (Este es el flujo normal después del registro inicial)
            const actualizado = await actualizarPaciente({
                id_paciente: existing.id_paciente, // Usamos la PK de la tabla paciente
                dni,
                telefono,
                edad,
                id_responsable: null,
                direccion: null
            });
            return res.status(200).json({
                mensaje: "✅ Perfil actualizado con éxito",
                paciente: actualizado
            });
        }

        // 3. CREAR (Este bloque SOLO se ejecutaría si la fila se borró o el registro inicial falló)
        // Ya no debería ejecutarse si el registro de usuario funciona correctamente.
        const nuevo = await crearPaciente({
            id_usuario,
            dni,
            telefono,
            edad,
            id_responsable: null,
            direccion: null
        });

        res.status(201).json({
            mensaje: "✅ Perfil completado con éxito. ¡Continuá a la reserva!",
            paciente: nuevo
        });

    } catch (error) {
        console.error("Error en crearOActualizarPaciente:", error);
        res.status(500).json({ error: "Error interno al actualizar paciente." });
    }
};

// ... (El resto de las funciones se mantiene igual) ...

// 🔹 NUEVA FUNCIÓN: Verificar si el perfil está completo
export const verificarPerfilCompleto = async (req, res) => {
    try {
        const id_usuario_logueado = req.usuario.id; 

        const paciente = await obtenerPacientePorUsuario(id_usuario_logueado);
        
        // Asumimos que si la fila de paciente existe Y el DNI no es '0' o null, está completo.
        // Esto es más robusto que solo verificar la existencia de la fila.
        const perfilCompleto = paciente && paciente.dni !== '0' && paciente.dni !== null;

        res.status(200).json({ 
            perfilCompleto: perfilCompleto,
            mensaje: perfilCompleto ? "Perfil completo" : "Perfil incompleto, requiere finalización."
        });

    } catch (error) {
        console.error("Error en verificarPerfilCompleto:", error);
        res.status(500).json({ error: "Error interno al verificar perfil del paciente." });
    }
};

/**
 * Obtener paciente por id_usuario
 */
export const verPacientePorUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const paciente = await obtenerPacientePorUsuario(id_usuario);

        if (!paciente) return res.status(404).json({ error: "Paciente no encontrado." });

        res.json(paciente);
    } catch (error) {
        console.error("Error en verPacientePorUsuario:", error);
        res.status(500).json({ error: "Error al obtener datos del paciente." });
    }
};

/**
 * Obtener turnos de un paciente por id
 */
export const verTurnosPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(
            "SELECT * FROM turno WHERE id_paciente = ?",
            [id]
        );
        res.json(rows);
    } catch (error) {
        console.error("Error en verTurnosPaciente:", error);
        res.status(500).json({ error: "Error al obtener turnos del paciente." });
    }
};

/**
 * Agendar/Reservar Turno
 */
export const reservarTurno = async (req, res) => {
    try {
        const { id_paciente, id_medico, fecha, hora } = req.body;
        if (!id_paciente || !id_medico || !fecha || !hora) {
            return res.status(400).json({ error: "Faltan datos para reservar el turno." });
        }

        await db.query(
            `INSERT INTO turno (id_paciente, id_medico, fecha, hora) VALUES (?, ?, ?, ?)`,
            [id_paciente, id_medico, fecha, hora]
        );

        res.status(201).json({ mensaje: "✅ Turno agendado con éxito." });
    } catch (error) {
        console.error("Error en reservarTurno:", error);
        res.status(500).json({ error: "Error al reservar turno." });
    }
};