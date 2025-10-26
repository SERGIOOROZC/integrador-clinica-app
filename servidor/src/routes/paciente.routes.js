// src/routes/paciente.routes.js (VERSIÓN CORREGIDA Y ROBUSTA)

import { Router } from "express";
import {
    crearOActualizarPaciente,
    verPacientePorUsuario,
    verTurnosPaciente,
    reservarTurno,
    verificarPerfilCompleto,
    // La función 'crearOActualizarPaciente' ahora servirá para la ruta PUT
} from "../controllers/paciente.controller.js";
import { validarPaciente } from "../middleware/validaciones.js";
import { autenticarJWT, autorizarRol } from "../middleware/auth.js";

const router = Router();

// =================================================================
// 🚨 RUTA DE ACTUALIZACIÓN: Completar perfil de paciente (PUT /paciente/:id)
// ✅ Esta reemplaza a la ruta POST y usa el ID de la URL
// =================================================================
router.put(
    "/:id", // <-- Se espera el ID del usuario en la URL (ej: /paciente/123)
    autenticarJWT, // Protegida: solo usuarios logueados
    autorizarRol(["paciente"]), // Solo el rol paciente puede usarla
    //validarPaciente, // Validación de datos
    crearOActualizarPaciente // Controlador que ahora realiza el UPDATE
);

// =================================================================
// 🔹 RUTA PROTEGIDA: Verificar si el paciente completó el perfil
// =================================================================
router.get(
    "/verificar-perfil", 
    autenticarJWT, 
    autorizarRol(["paciente"]), 
    verificarPerfilCompleto
);

// =================================================================
// ✅ RUTA PÚBLICA: Reservar turno (POST /paciente/reservar)
// =================================================================
router.post(
    "/reservar",
    reservarTurno
);

// =================================================================
// 🔹 RUTA PROTEGIDA: Ver turnos de un paciente por id (GET /paciente/:id/turnos)
// =================================================================
router.get(
    "/:id/turnos",
    autenticarJWT,
    autorizarRol(["admin", "paciente"]),
    verTurnosPaciente
);

// =================================================================
// 🔹 RUTA PROTEGIDA: Obtener datos de un paciente por id_usuario (GET /paciente/usuario/:id_usuario)
// =================================================================
router.get(
    "/usuario/:id_usuario",
    autenticarJWT,
    autorizarRol(["admin", "paciente"]),
    verPacientePorUsuario
);

export default router;