import { Router } from "express";
import { 
  listarEspecialidades,    // GET: lista todas las especialidades
  crearEspecialidad,       // POST: crear nueva especialidad
  actualizarEspecialidad,  // PUT: actualizar especialidad existente
  eliminarEspecialidad     // DELETE: eliminar especialidad
} from "../controllers/especialidad.controller.js";

import { autenticarJWT, autorizarRol } from "../middleware/auth.js";

const router = Router();

// ==========================================================
// Endpoint: GET /especialidad
// Listar todas las especialidades
// Cualquier usuario autenticado puede verlas
// Esto sirve para que el formulario de registro de médicos sea dinámico
// y la BD centralice la fuente de verdad de especialidades
// ==========================================================
router.get("/", autenticarJWT, listarEspecialidades);

// ==========================================================
// Endpoint: POST /especialidad
// Crear nueva especialidad
// Solo accesible por admin
// ==========================================================
router.post("/", autenticarJWT, autorizarRol(["admin"]), crearEspecialidad);

// ==========================================================
// Endpoint: PUT /especialidad/:id
// Actualizar una especialidad existente
// Solo admin puede actualizar
// ==========================================================
router.put("/:id", autenticarJWT, autorizarRol(["admin"]), actualizarEspecialidad);

// ==========================================================
// Endpoint: DELETE /especialidad/:id
// Eliminar una especialidad
// Solo admin puede eliminar
// ==========================================================
router.delete("/:id", autenticarJWT, autorizarRol(["admin"]), eliminarEspecialidad);

export default router;

// 🔹 Propósito principal de estas rutas:
// 1. Hacer que el formulario de registro de médicos sea dinámico.
// 2. Centralizar la fuente de verdad para las especialidades en la BD.
