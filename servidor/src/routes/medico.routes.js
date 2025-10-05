import { Router } from "express";
import {
  registrarMedico,
  verTurnosMedico
} from "../controllers/medico.controller.js";
import { validarMedico } from "../middleware/validaciones.js";
import { autenticarJWT, autorizarRol } from "../middleware/auth.js";

const router = Router();

// 🔹 Registrar médico (solo lo puede hacer un admin) ->autorizarRol
router.post(
  "/",
  autenticarJWT,
  autorizarRol(["admin"]),
  validarMedico,
  registrarMedico
);

// 🔹 Ver turnos de un médico (el propio médico o el admin) ->autorizarRol
router.get(
  "/:id/turnos",
  autenticarJWT,
  autorizarRol(["admin", "medico"]),
  verTurnosMedico
);

export default router;
