// src/controllers/medico.controller.js

// ==========================================================
// 🧩 IMPORTS: Funciones del modelo médico
// ==========================================================
import { 
    crearMedico, 
    obtenerTurnosMedico, 
    obtenerTodosLosMedicos,
    actualizarMedicoDB,   // ✅ Actualizar datos del médico
    eliminarMedicoDB      // ✅ Eliminar médico
} from "../models/medico.models.js";


// ==========================================================
// 1️⃣ LISTAR MÉDICOS (GET /api/medico)
// ==========================================================
// - Devuelve todos los médicos con su especialidad.
// - Usado por pacientes (para reservar) y admin (para gestionar).
export const listarMedicos = async (req, res) => {
    try {
        const medicos = await obtenerTodosLosMedicos();

        if (!medicos || medicos.length === 0) {
            return res.status(404).json({
                mensaje: "No se encontraron médicos disponibles."
            });
        }

        res.status(200).json({
            mensaje: "Lista de médicos obtenida correctamente.",
            medicos
        });

    } catch (error) {
        console.error("❌ Error en listarMedicos:", error);
        res.status(500).json({
            error: "Error interno del servidor al obtener la lista de médicos."
        });
    }
};


// ==========================================================
// 2️⃣ REGISTRAR MÉDICO (POST /api/medico)
// ==========================================================
// - Crea un nuevo registro de médico (solo admin).
// - Requiere datos validados en el middleware.
export const registrarMedico = async (req, res) => {
    try {
        const medico = await crearMedico(req.body);

        res.status(201).json({
            mensaje: "Médico registrado correctamente.",
            medico
        });

    } catch (error) {
        console.error("❌ Error en registrarMedico:", error);
        res.status(500).json({
            error: "Error interno del servidor al registrar el médico."
        });
    }
};


// ==========================================================
// 3️⃣ ACTUALIZAR MÉDICO (PUT /api/medico/:id)
// ==========================================================
// - Permite modificar datos de un médico existente.
// - Solo accesible por el administrador.
export const actualizarMedico = async (req, res) => {
    try {
        const { id } = req.params;
        const cambios = req.body; // Campos a actualizar

        const resultado = await actualizarMedicoDB(id, cambios);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Médico no encontrado para actualizar."
            });
        }

        res.status(200).json({
            mensaje: "Médico actualizado correctamente.",
            cambios
        });

    } catch (error) {
        console.error("❌ Error en actualizarMedico:", error);
        res.status(500).json({
            error: "Error interno del servidor al actualizar el médico."
        });
    }
};


// ==========================================================
// 4️⃣ ELIMINAR MÉDICO (DELETE /api/medico/:id)
// ==========================================================
// - Elimina un registro de médico.
// - Solo accesible por el administrador.
export const eliminarMedico = async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await eliminarMedicoDB(id);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Médico no encontrado para eliminar."
            });
        }

        res.status(200).json({
            mensaje: "Médico eliminado correctamente."
        });

    } catch (error) {
        console.error("❌ Error en eliminarMedico:", error);
        res.status(500).json({
            error: "Error interno del servidor al eliminar el médico."
        });
    }
};


// ==========================================================
// 5️⃣ VER TURNOS DE UN MÉDICO (GET /api/medico/:id/turnos)
// ==========================================================
// - Devuelve todos los turnos asociados a un médico.
// - Accesible por el propio médico o el admin.
export const verTurnosMedico = async (req, res) => {
    try {
        const { id } = req.params;
        const turnos = await obtenerTurnosMedico(id);

        if (!turnos || turnos.length === 0) {
            return res.status(404).json({
                mensaje: "No se encontraron turnos para este médico."
            });
        }

        res.status(200).json({
            mensaje: "Turnos obtenidos correctamente.",
            turnos
        });

    } catch (error) {
        console.error("❌ Error en verTurnosMedico:", error);
        res.status(500).json({
            error: "Error interno del servidor al obtener los turnos del médico."
        });
    }
};
