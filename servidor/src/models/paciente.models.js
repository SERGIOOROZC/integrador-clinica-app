import db from "../config/db.js";

export const crearPaciente = async (paciente) => {
  const { id_usuario, dni, telefono, edad } = paciente;
  const [result] = await db.query(
    "INSERT INTO paciente (id_usuario, dni, telefono, edad) VALUES (?, ?, ?, ?)",
    [id_usuario, dni, telefono, edad]
  );
  return { id_paciente: result.insertId, ...paciente };
};

export const obtenerTurnosPaciente = async (id_paciente) => {
  const [rows] = await db.query(
    "SELECT * FROM turno WHERE id_paciente = ?",
    [id_paciente]
  );
  return rows;
};
