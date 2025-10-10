// src/routes/medico.routes.js

import { Router } from "express";
import {
  registrarMedico,
  verTurnosMedico,
  listarMedicos, // 🔑 Función para listar todos los médicos
} from "../controllers/medico.controller.js";
import { validarMedico } from "../middleware/validaciones.js";
import { autenticarJWT, autorizarRol } from "../middleware/auth.js";

const router = Router();

// ==========================================================
// RUTA 1: OBTENER LISTA DE MÉDICOS (Para el Paciente/Admin)
// ==========================================================
// Mapea a: GET /api/medico
// Permite que un usuario logueado (paciente o admin) vea la lista para reservar.
router.get(
  "/",
  autenticarJWT, // Requiere que el usuario esté autenticado
  listarMedicos // Llama al controlador que consulta la DB
);


// ==========================================================
// RUTA 2: REGISTRAR UN NUEVO MÉDICO
// ==========================================================
// Mapea a: POST /api/medico
// Solo accesible por el administrador.
router.post(
  "/",
  autenticarJWT,
  autorizarRol(["admin"]), // Solo rol 'admin'
  validarMedico,
  registrarMedico
);

// ==========================================================
// RUTA 3: VER TURNOS DE UN MÉDICO ESPECÍFICO
// ==========================================================
// Mapea a: GET /api/medico/:id/turnos
// Accesible por el propio médico o por un administrador.
router.get(
  "/:id/turnos",
  autenticarJWT,
  autorizarRol(["admin", "medico"]), // Solo roles 'admin' o 'medico'
  verTurnosMedico
);

export default router;