import { body, validationResult } from "express-validator";

/* ------------------------------------------------------------
    🔹 Middleware general para manejar errores de validación
------------------------------------------------------------ */
export const manejarErrores = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Devuelve un array de errores en formato JSON con status 400
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

/* ------------------------------------------------------------
    ✅ Validación para USUARIO (No modificado)
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
    ✅ Validación para PACIENTE (No modificado)
------------------------------------------------------------ */
export const validarPaciente = [
    body("id_usuario").isInt().withMessage("id_usuario debe ser un número entero"),
    body("dni").notEmpty().withMessage("El DNI es obligatorio"),
    body("telefono").notEmpty().withMessage("El teléfono es obligatorio"),
    manejarErrores,
];

/* ------------------------------------------------------------
    ✅ Validación para MÉDICO (CORREGIDA)
    
    Asegura que los campos requeridos por el modelo y la DB están presentes.
    id_usuario es CRÍTICO para la FK.
------------------------------------------------------------ */
export const validarMedico = [
    body("id_usuario")
        .isInt()
        .withMessage("id_usuario debe ser un número entero"),
    body("nombre")
        .notEmpty()
        .withMessage("El nombre es obligatorio"),
    body("apellido")
        .notEmpty()
        .withMessage("El apellido es obligatorio"),
    body("id_especialidad")
        .isInt()
        .withMessage("id_especialidad debe ser un número entero"),
    manejarErrores,
];

/* ------------------------------------------------------------
    ✅ Validación para TURNO (CREACIÓN) (No modificado)
------------------------------------------------------------ */
export const validarTurno = [
    body("id_medico")
        .isInt({ min: 1 })
        .withMessage("id_medico debe ser un número entero válido"),
    body("id_paciente")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("id_paciente debe ser un número entero válido"),
    body("fecha")
        .isISO8601()
        .withMessage("La fecha debe estar en formato YYYY-MM-DD"),
    body("hora")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("La hora debe estar en formato HH:MM (24hs)"),
    body("estado")
        .optional({ checkFalsy: true })
        .isIn(["Pendiente", "Reservado", "Cancelado", "Confirmado"])
        .withMessage("El estado debe ser 'Pendiente', 'Reservado', 'Cancelado' o 'Confirmado'"),
    manejarErrores,
];

/* ------------------------------------------------------------
    ✅ Validación para ACTUALIZAR TURNO (No modificado)
------------------------------------------------------------ */
export const validarActualizacionTurno = [
    body("estado")
        .optional({ checkFalsy: true })
        .isIn(["Pendiente", "Reservado", "Cancelado", "Confirmado"])
        .withMessage("El estado debe ser 'Pendiente', 'Reservado', 'Cancelado' o 'Confirmado'"),
    body("fecha")
        .optional({ checkFalsy: true })
        .isISO8601()
        .withMessage("La fecha debe estar en formato YYYY-MM-DD"),
    body("hora")
        .optional({ checkFalsy: true })
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("La hora debe estar en formato HH:MM (24hs)"),
    body("motivo")
        .optional({ checkFalsy: true })
        .isString()
        .withMessage("El motivo debe ser un texto válido"),
    manejarErrores,
];

/* ------------------------------------------------------------
    ✅ Validación para LOGIN (No modificado)
------------------------------------------------------------ */
export const validarLogin = [
    body("email").isEmail().withMessage("Debe ser un email válido"),
    body("password").notEmpty().withMessage("La contraseña es obligatoria"),
    manejarErrores,
];