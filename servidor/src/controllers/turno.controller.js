import db from "../config/db.js"; // 🚨 Importación Crítica para la búsqueda de ID
import { 
    obtenerTurnos, 
    crearTurno, 
    eliminarTurno, 
    actualizarTurno as actualizarTurnoModel, 
    verificarDisponibilidad 
} from "../models/turno.models.js";


// =========================================================
// 🔑 FUNCIÓN DE UTILIDAD: TRADUCCIÓN DE ID
// =========================================================

/**
 * Busca el ID primario de la tabla 'paciente' usando el ID de usuario (FK).
 * @param {number} idUsuario - El ID del usuario logueado (desde el token).
 * @returns {Promise<number|null>} El id_paciente o null si no existe.
 */
const obtenerIdPacientePorUsuarioId = async (idUsuario) => {
    const [rows] = await db.query(
        "SELECT id_paciente FROM paciente WHERE id_usuario = ?",
        [idUsuario]
    );
    return rows.length > 0 ? rows[0].id_paciente : null;
};


// =========================================================
// 🔹 Listar turnos: Maneja el filtro por rol
// =========================================================
export const listarTurnos = async (req, res) => {
    try {
        const idMedicoFiltro = req.query.id_medico; 
        
        // Asumimos que el middleware JWT decodifica a { id_usuario, rol }
        const { id_usuario, rol } = req.user; 
        let filtros = {};
        
        // 1. Caso Calendario: Mostrar disponibilidad de un médico
        if (idMedicoFiltro) {
            filtros.id_medico = idMedicoFiltro; 
        
        // 2. Caso Historial: Médico
        } else if (rol === "medico") {
            filtros.id_medico = id_usuario; 
        
        // 3. Caso Historial: Paciente
        } else if (rol === "paciente") {
            const idPacienteReal = await obtenerIdPacientePorUsuarioId(id_usuario);
            if (!idPacienteReal) {
                return res.status(400).json({ error: "Perfil de paciente incompleto o no encontrado." });
            }
            filtros.id_paciente = idPacienteReal;
        } 
        
        // 4. Caso Admin: sin filtros
        const turnos = await obtenerTurnos(filtros);
        
        res.json(turnos);

    } catch (error) {
        console.error("Error al listar turnos:", error);
        res.status(500).json({ error: "Error interno al listar turnos." });
    }
};


// =========================================================
// 🔹 Crear un nuevo turno (SEGURO contra suplantación y garantiza 'estado')
// =========================================================
export const nuevoTurno = async (req, res) => {
    const { id_medico, fecha, hora, motivo } = req.body; 
    const idUsuarioLogueado = req.user.id_usuario; 

    try {
        // 1. SEGURIDAD: Obtener el ID_PACIENTE real (el PK)
        const id_paciente_real = await obtenerIdPacientePorUsuarioId(idUsuarioLogueado);
        if (!id_paciente_real) {
            return res.status(400).json({ error: "Perfil de paciente incompleto o no encontrado." });
        }

        // 2. VERIFICACIÓN DE DISPONIBILIDAD
        const estaOcupado = await verificarDisponibilidad(id_medico, fecha, hora); 
        if (estaOcupado) {
            return res.status(409).json({ 
                error: "El horario seleccionado ya está reservado. Por favor, elige otro." 
            });
        }

        // 3. Si está libre, procede con la inserción
        const turnoData = {
            id_paciente: id_paciente_real, 
            id_medico,
            fecha,
            hora,
            motivo, // Se mapea en el modelo a 'observaciones'
            estado: 'Pendiente' // ⬅️ Estado inicial forzado
        };

        const nuevo = await crearTurno(turnoData);
        
        res.status(201).json({
            mensaje: "Turno reservado exitosamente",
            turno: nuevo 
        });
        
    } catch (error) {
        console.error("Error al crear turno:", error);
        res.status(500).json({ error: "Error interno del servidor al crear turno." });
    }
};


// =========================================================
// 🔹 Borrar un turno por ID
// =========================================================
export const borrarTurno = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await eliminarTurno(id);

        res.json({
            mensaje: "Turno eliminado correctamente",
            resultado
        });
    } catch (error) {
        console.error("Error al borrar turno:", error);
        res.status(500).json({ error: "Error interno al borrar el turno." });
    }
};


// =========================================================
// 🔹 Actualizar un turno por ID
// =========================================================
export const actualizarTurno = async (req, res) => {
    try {
        const { id } = req.params; 
        const datosActualizados = req.body; 

        const turnoActualizado = await actualizarTurnoModel(id, datosActualizados);

        res.json({
            mensaje: "Turno actualizado exitosamente",
            turno: turnoActualizado
        });

    } catch (error) {
        console.error("Error al actualizar el turno:", error);
        res.status(500).json({ error: "Error interno al actualizar el turno." });
    }
};
