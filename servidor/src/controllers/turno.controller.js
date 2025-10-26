// src/controllers/turno.controller.js
import db from "../config/db.js"; // Importación crítica
import { 
    obtenerTurnos, 
    crearTurno, 
    eliminarTurno, 
    actualizarTurno as actualizarTurnoModel, 
    verificarDisponibilidad 
} from "../models/turno.models.js";

/* =========================================================
   🔹 Utilidad: Obtener ID de paciente a partir del ID de usuario
========================================================= */
const obtenerIdPacientePorUsuarioId = async (idUsuario) => {
    const [rows] = await db.query(
        "SELECT id_paciente FROM paciente WHERE id_usuario = ?",
        [idUsuario]
    );
    return rows.length > 0 ? rows[0].id_paciente : null;
};

/* =========================================================
   🔹 Listar turnos según rol
========================================================= */
export const listarTurnos = async (req, res) => {
    try {
        const idMedicoFiltro = req.query.id_medico; 
        const { id_usuario, rol } = req.user; 
        let filtros = {};

        if (idMedicoFiltro) {
            filtros.id_medico = idMedicoFiltro; 
        } else if (rol === "medico") {
            filtros.id_medico = id_usuario; 
        } else if (rol === "paciente") {
            const idPacienteReal = await obtenerIdPacientePorUsuarioId(id_usuario);
            if (!idPacienteReal) return res.status(400).json({ error: "Perfil de paciente no encontrado." });
            filtros.id_paciente = idPacienteReal;
        }
        // Admin: sin filtros

        const turnos = await obtenerTurnos(filtros);
        res.json(turnos);
    } catch (error) {
        console.error("Error al listar turnos:", error);
        res.status(500).json({ error: "Error interno al listar turnos." });
    }
};

/* =========================================================
   🔹 Crear turno (solo admin o paciente)
========================================================= */
export const nuevoTurno = async (req, res) => {
    const { id_medico, fecha, hora, motivo } = req.body;
    const idUsuarioLogueado = req.user.id_usuario;

    try {
        // 1️⃣ Obtener paciente real
        const id_paciente_real = await obtenerIdPacientePorUsuarioId(idUsuarioLogueado);
        if (!id_paciente_real) return res.status(400).json({ error: "Perfil de paciente no encontrado." });

        // 2️⃣ Verificar disponibilidad
        const estaOcupado = await verificarDisponibilidad(id_medico, fecha, hora);
        if (estaOcupado) return res.status(409).json({ error: "Horario ocupado. Elige otro." });

        // 3️⃣ Crear turno con estado inicial "Pendiente"
        const turnoData = {
            id_paciente: id_paciente_real,
            id_medico,
            fecha,
            hora,
            motivo,
            estado: "Pendiente"
        };

        const nuevo = await crearTurno(turnoData);
        res.status(201).json({ mensaje: "Turno reservado exitosamente", turno: nuevo });

    } catch (error) {
        console.error("Error al crear turno:", error);
        res.status(500).json({ error: "Error interno al crear turno." });
    }
};

/* =========================================================
   🔹 Eliminar turno
========================================================= */
export const borrarTurno = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await eliminarTurno(id);
        res.json({ mensaje: "Turno eliminado correctamente", resultado });
    } catch (error) {
        console.error("Error al borrar turno:", error);
        res.status(500).json({ error: "Error interno al borrar turno." });
    }
};

/* =========================================================
   🔹 Actualizar turno (solo campos permitidos)
========================================================= */
export const actualizarTurno = async (req, res) => {
    console.log(`[TurnoController] 💡 PUT /turnos/${req.params.id}`);

    try {
        const { id } = req.params;
        const datosActualizados = req.body;

        // 🧩 Validación mínima (opcional)
        if (!id) return res.status(400).json({ error: "Falta el ID del turno." });

        // 2️⃣ Actualizar turno en base de datos
        const turnoActualizado = await actualizarTurnoModel(id, datosActualizados);
        res.json({ mensaje: "Turno actualizado exitosamente", turno: turnoActualizado });

    } catch (error) {
        console.error("Error al actualizar el turno:", error);

        if (error.message?.includes("NoEncontrado")) {
            return res.status(404).json({ error: "Turno no encontrado." });
        }

        res.status(500).json({ error: "Error interno al actualizar el turno." });
    }
};
