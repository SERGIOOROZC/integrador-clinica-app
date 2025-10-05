import { Router } from "express";
import { registrarPaciente,verTurnosPaciente} from "../controllers/paciente.controller.js";
import { validarPaciente } from "../middleware/validaciones.js";
import { autenticarJWT, autorizarRol } from "../middleware/auth.js";

const router = Router();

// 🔹 Registrar paciente (admin o un usuario que se registre como paciente)
router.post(
  "/",
  autenticarJWT,
  autorizarRol(["admin", "paciente"]),
  validarPaciente,
  registrarPaciente
);

// 🔹 Ver turnos de un paciente (el propio paciente o el admin)
router.get(
  "/:id/turnos",
  autenticarJWT,
  autorizarRol(["admin", "paciente"]),
  verTurnosPaciente
);

export default router;
