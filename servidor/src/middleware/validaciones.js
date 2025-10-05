import { body, validationResult } from "express-validator";

// 🔹 Middleware general para manejar errores
export const manejarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ---------------- VALIDACIONES ---------------- //

// ✅ Validación para Usuario
export const validarUsuario = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("apellido").notEmpty().withMessage("El apellido es obligatorio"),
  body("email").isEmail().withMessage("Debe ser un email válido"),
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener mínimo 6 caracteres"),
  body("rol")
    .isIn(["paciente", "medico", "admin"])
    .withMessage("El rol debe ser 'paciente', 'medico' o 'admin'"),
  manejarErrores,
];

// ✅ Validación para Paciente
export const validarPaciente = [
  body("id_usuario").isInt().withMessage("id_usuario debe ser un número entero"),
  body("dni").notEmpty().withMessage("El DNI es obligatorio"),
  body("telefono").notEmpty().withMessage("El teléfono es obligatorio"),
  manejarErrores,
];

// ✅ Validación para Médico
export const validarMedico = [
  body("id_usuario").isInt().withMessage("id_usuario debe ser un número entero"),
  body("matricula").notEmpty().withMessage("La matrícula es obligatoria"),
  body("especialidad").notEmpty().withMessage("La especialidad es obligatoria"),
  manejarErrores,
];

// ✅ Validación para Turno
export const validarTurno = [
  body("id_medico").isInt().withMessage("id_medico debe ser un número entero"),
  body("id_paciente").optional().isInt().withMessage("id_paciente debe ser un número entero"),
  body("fecha").isISO8601().withMessage("La fecha debe estar en formato YYYY-MM-DD"),
  body("hora").matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("La hora debe estar en formato HH:MM"),
  body("estado")
    .isIn(["libre", "reservado", "cancelado"])
    .withMessage("El estado debe ser 'libre', 'reservado' o 'cancelado'"),
  manejarErrores,
];

// ✅ Validación para Login
export const validarLogin = [
  body("email").isEmail().withMessage("Debe ser un email válido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  manejarErrores,
];
