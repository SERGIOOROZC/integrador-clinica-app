// src/routes/medico.routes.js

import { Router } from "express";
import {
  registrarMedico,
  verTurnosMedico,
  listarMedicos,
  actualizarMedico, // ✅ CRUD: actualizar
  eliminarMedico,   // ✅ CRUD: eliminar
} from "../controllers/medico.controller.js";

import { validarMedico } from "../middleware/validaciones.js";
import { autenticarJWT, autorizarRol } from "../middleware/auth.js";

const router = Router();

/* ==========================================================
   🩺 1. OBTENER LISTA DE MÉDICOS (GET /api/medico)
   ----------------------------------------------------------
   - Permite listar todos los médicos con su especialidad.
   - Usado por pacientes para reservar turno o por admin.
   ========================================================== */
router.get(
  "/",
  autenticarJWT,  // Requiere token válido
  listarMedicos   // Controlador: obtiene médicos del modelo
);


/* ==========================================================
   ➕ 2. REGISTRAR NUEVO MÉDICO (POST /api/medico)
   ----------------------------------------------------------
   - Solo puede hacerlo el ADMIN.
   - Usa validación del body y middleware de autenticación.
   ========================================================== */
router.post(
  "/",
  autenticarJWT,
  autorizarRol(["admin"]), // Solo el admin puede registrar médicos
  validarMedico,           // Verifica campos requeridos (nombre, especialidad, etc.)
  registrarMedico
);


/* ==========================================================
   ✏️ 3. ACTUALIZAR MÉDICO EXISTENTE (PUT /api/medico/:id)
   ----------------------------------------------------------
   - Solo el ADMIN puede editar los datos de un médico.
   ========================================================== */
router.put(
  "/:id",
  autenticarJWT,
  autorizarRol(["admin"]),
  actualizarMedico
);


/* ==========================================================
   ❌ 4. ELIMINAR MÉDICO (DELETE /api/medico/:id)
   ----------------------------------------------------------
   - Solo el ADMIN puede eliminar un médico.
   ========================================================== */
router.delete(
  "/:id",
  autenticarJWT,
  autorizarRol(["admin"]),
  eliminarMedico
);


/* ==========================================================
   📅 5. VER TURNOS DE UN MÉDICO (GET /api/medico/:id/turnos)
   ----------------------------------------------------------
   - El propio médico o el admin puede consultar sus turnos.
   ========================================================== */
router.get(
  "/:id/turnos",
  autenticarJWT,
  autorizarRol(["admin", "medico"]),
  verTurnosMedico
);

export default router;
