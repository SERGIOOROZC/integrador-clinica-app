import { Router } from "express";
// Asegúrate de importar la nueva función reservarTurno
import { crearOActualizarPaciente, verTurnosPaciente, reservarTurno } from "../controllers/paciente.controller.js";
import { validarPaciente } from "../middleware/validaciones.js";
import { autenticarJWT, autorizarRol } from "../middleware/auth.js"; 

const router = Router();

// =================================================================
// ✅ RUTA PÚBLICA: Registrar/Actualizar paciente (POST /) - Completar Perfil
// La seguridad JWT ha sido ELIMINADA para este flujo.
// =================================================================
router.post(
    "/",
    // 🚨 MIDDLEWARE DE DEPURACIÓN TEMPORAL (Mantenido) 🚨
    (req, res, next) => {
        console.log("==========================================");
        console.log("✅ RUTA POST /paciente RECIBIDA (PERFIL PÚBLICO)");
        console.log("==========================================");
        next(); 
    },
    // ----------------------------------------
    // ❌ ELIMINADO: autenticarJWT, autorizarRol
    // ----------------------------------------
    validarPaciente, // Mantiene la validación de datos de perfil
    crearOActualizarPaciente // Controlador
);

// =================================================================
// ✅ RUTA PÚBLICA: Agendar/Reservar Turno (POST /reservar)
// Esta ruta también se hace pública para el flujo de inicio.
// =================================================================
router.post(
    "/reservar", 
    // Podrías añadir un middleware de validación aquí, ej: validarReserva
    reservarTurno 
);


// =================================================================
// 🔹 RUTA PROTEGIDA: Ver turnos de un paciente (GET /:id/turnos)
// Esta ruta MANTIENE la seguridad JWT ya que muestra información privada.
// =================================================================
router.get(
    "/:id/turnos",
    autenticarJWT,
    autorizarRol(["admin", "paciente"]),
    verTurnosPaciente
);

export default router;