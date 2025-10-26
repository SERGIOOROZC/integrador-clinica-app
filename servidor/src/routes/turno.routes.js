import { Router } from "express";
import {
    listarTurnos,
    nuevoTurno,
    borrarTurno,
    actualizarTurno
} from "../controllers/turno.controller.js";
import { validarTurno } from "../middleware/validaciones.js";
import { autenticarJWT, autorizarRol } from "../middleware/auth.js";

const router = Router();

// =========================================================
// 🔹 LISTAR TURNOS
// =========================================================
// - Admin ve TODOS los turnos.
// - Médico ve SOLO sus turnos asignados.
// - Paciente ve SOLO sus turnos propios.
// (El filtrado se maneja dentro del controlador según el rol del token)
router.get(
    "/",
    autenticarJWT,
    autorizarRol(["admin", "medico", "paciente"]),
    listarTurnos
);

// =========================================================
// 🔹 CREAR TURNO
// =========================================================
// - Solo "admin" y "paciente" pueden crear turnos.
// - Los médicos no pueden autogenerarse un turno.
// - Se valida la estructura de datos (fecha, hora, etc.) con `validarTurno`.
router.post(
    "/",
    autenticarJWT,
    autorizarRol(["admin", "paciente"]),
    validarTurno,
    nuevoTurno
);

// =========================================================
// 🔹 BORRAR TURNO
// =========================================================
// - Solo "admin" y "medico" pueden eliminar turnos.
// - Se usa DELETE con el ID en la URL (ej: /turno/12)
router.delete(
    "/:id",
    autenticarJWT,
    autorizarRol(["admin", "medico"]),
    borrarTurno
);

// =========================================================
// 🔹 ACTUALIZAR / EDITAR TURNO
// =========================================================
// - Solo "admin" y "medico" pueden modificar turnos.
// - Por ejemplo: actualizar estado (Pendiente, Atendido, Cancelado).
// - Valida formato de datos antes de actualizar.
router.put(
    "/:id",
    autenticarJWT,
    autorizarRol(["admin", "medico"]),
    validarTurno,
    actualizarTurno
);

export default router;
