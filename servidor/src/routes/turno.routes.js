import { Router } from "express";
import {
    listarTurnos,
    nuevoTurno,
    borrarTurno,
    actualizarTurno
} from "../controllers/turno.controller.js";
// 🚨 CORREGIDO: Ahora importamos AMBAS validaciones: la estricta para POST y la parcial para PUT
import { validarTurno, validarActualizacionTurno } from "../middleware/validaciones.js"; 
import { autenticarJWT, autorizarRol } from "../middleware/auth.js";

const router = Router();

// =========================================================
// 🔹 LISTAR TURNOS
// =========================================================
// - Admin ve TODOS los turnos.
// - Médico ve SOLO sus turnos asignados.
// - Paciente ve SOLO sus turnos propios.
router.get(
    "/",
    autenticarJWT,
    autorizarRol(["admin", "medico", "paciente"]),
    listarTurnos
);

// =========================================================
// 🔹 CREAR TURNO
// =========================================================
// - Requiere campos completos (fecha, hora, id_medico) y usa 'validarTurno' para chequearlos.
router.post(
    "/",
    autenticarJWT,
    autorizarRol(["admin", "paciente"]),
    validarTurno, // ⬅️ Validación estricta OK para CREACIÓN
    nuevoTurno
);

// =========================================================
// 🔹 BORRAR TURNO
// =========================================================
// - Permite a "admin" y "medico" eliminar.
router.delete(
    "/:id",
    autenticarJWT,
    autorizarRol(["admin", "medico"]),
    borrarTurno
);

// =========================================================
// 🔹 ACTUALIZAR / EDITAR TURNO (SOLUCIÓN FINAL)
// =========================================================
// - Solo "admin" y "medico" pueden modificar turnos.
// - Usamos la validación PARCIAL para permitir que solo se envíe el campo 'estado'.
router.put(
    "/:id",
    autenticarJWT,
    autorizarRol(["admin", "medico"]),
    validarActualizacionTurno, // ⬅️ MIDDLEWARE CLAVE AGREGADO: Solo valida el campo 'estado'
    actualizarTurno 
);

export default router;