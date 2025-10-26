import { body, validationResult } from "express-validator";

/* ------------------------------------------------------------
   🔹 Middleware general para manejar errores de validación
------------------------------------------------------------ */
export const manejarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Si hay errores, los devuelve al frontend con status 400
    return res.status(400).json({ errors: errors.array() });
  }
  next(); // Continúa al siguiente middleware o controlador
};

/* ------------------------------------------------------------
   ✅ Validación para USUARIO
------------------------------------------------------------ */
export const validarUsuario = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("apellido").notEmpty().withMessage("El apellido es obligatorio"),
  body("email").isEmail().withMessage("Debe ser un email válido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener mínimo 6 caracteres"),
  body("rol")
    .isIn(["paciente", "medico", "admin"])
    .withMessage("El rol debe ser 'paciente', 'medico' o 'admin'"),
  manejarErrores,
];

/* ------------------------------------------------------------
   ✅ Validación para PACIENTE
------------------------------------------------------------ */
export const validarPaciente = [
  body("id_usuario").isInt().withMessage("id_usuario debe ser un número entero"),
  body("dni").notEmpty().withMessage("El DNI es obligatorio"),
  body("telefono").notEmpty().withMessage("El teléfono es obligatorio"),
  manejarErrores,
];

/* ------------------------------------------------------------
   ✅ Validación para MÉDICO
------------------------------------------------------------ */
export const validarMedico = [
  body("id_usuario").isInt().withMessage("id_usuario debe ser un número entero"),
  body("matricula").notEmpty().withMessage("La matrícula es obligatoria"),
  body("especialidad").notEmpty().withMessage("La especialidad es obligatoria"),
  manejarErrores,
];

/* ------------------------------------------------------------
   ✅ Validación para TURNO
------------------------------------------------------------ */
export const validarTurno = [
  // id_medico siempre requerido
  body("id_medico")
    .isInt({ min: 1 })
    .withMessage("id_medico debe ser un número entero válido"),

  // id_paciente opcional (el admin puede crear turnos libres sin paciente asignado)
  body("id_paciente")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("id_paciente debe ser un número entero válido"),

  // Fecha en formato ISO (YYYY-MM-DD)
  body("fecha")
    .isISO8601()
    .withMessage("La fecha debe estar en formato YYYY-MM-DD"),

  // Hora en formato HH:MM (24hs)
  body("hora")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("La hora debe estar en formato HH:MM (24hs)"),

  // Estado controlado
  body("estado")
    .isIn(["Pendiente", "Libre", "Reservado", "Cancelado"])
    .withMessage(
      "El estado debe ser 'Pendiente', 'Libre', 'Reservado' o 'Cancelado'"
    ),

  manejarErrores,
];

/* ------------------------------------------------------------
   ✅ Validación para LOGIN
------------------------------------------------------------ */
export const validarLogin = [
  body("email").isEmail().withMessage("Debe ser un email válido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  manejarErrores,
];
