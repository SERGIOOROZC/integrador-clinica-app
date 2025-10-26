// src/controllers/paciente.controller.js
import db from "../config/db.js";

/**
 * Crea o actualiza el registro de paciente en la tabla 'paciente'.
 * Es llamado después de un login exitoso de un paciente o después del registro.
 */
export const crearOActualizarPaciente = async (req, res) => {
    try {
        // Obtenemos SOLO los campos necesarios para la tabla PACIENTE
        // Aunque recibamos 'nombre' y 'apellido', no los usamos en esta consulta, 
        // ya que la tabla paciente solo requiere la clave foránea y los datos del perfil.
        const { id_usuario, dni, telefono, edad } = req.body;

        // 1. Verificación de campos obligatorios
        if (!id_usuario || !dni || !telefono || !edad) {
            return res.status(400).json({ 
                error: "Faltan datos obligatorios para crear el perfil de paciente (ID de usuario, DNI, Teléfono o Edad)." 
            });
        }

        // 2. Verificamos si ya existe paciente con este id_usuario
        const [rows] = await db.query(
            "SELECT id_paciente FROM paciente WHERE id_usuario = ?",
            [id_usuario]
        );

        if (rows.length > 0) {
            // 3. Si el registro existe, lo actualizamos (UPDATE)
            await db.query(
                "UPDATE paciente SET dni = ?, telefono = ?, edad = ? WHERE id_usuario = ?",
                [dni, telefono, edad, id_usuario]
            );
        } else {
            // 4. Si el registro NO existe, lo creamos (INSERT)
            await db.query(
                "INSERT INTO paciente (id_usuario, dni, telefono, edad) VALUES (?, ?, ?, ?)",
                [id_usuario, dni, telefono, edad]
            );
        }

        // 5. Respuesta exitosa
        res.status(200).json({ 
            mensaje: "✅ Perfil completado con éxito. ¡Continuá a la reserva!",
            id_usuario,
            dni, 
            telefono, 
            edad 
        });
        
    } catch (error) {
        console.error("Error SQL al crear/actualizar paciente:", error); 
        res.status(500).json({ error: "Error interno del servidor al completar perfil." });
    }
};

/**
 * Obtener turnos de un paciente por su id
 */
export const verTurnosPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(
            "SELECT * FROM turno WHERE id_paciente = ?",
            [id]
        );
        res.json(rows);
    } catch (error) {
        console.error("Error en verTurnosPaciente:", error);
        res.status(500).json({ error: "Error al obtener turnos del paciente" });
    }
};

/**
 * Nuevo: Controlador para Agendar/Reservar Turno (Implementación de ejemplo)
 * Nota: Debes asegurar que esta función está completa en tu código.
 */
export const reservarTurno = async (req, res) => {
    // Código de la función reservarTurno...
    // Ejemplo simple:
    // const { id_paciente, id_medico, fecha, hora } = req.body;
    // await db.query("INSERT INTO turno (...) VALUES (...)");
    
    res.status(201).json({ mensaje: "✅ Turno agendado con éxito." });
};