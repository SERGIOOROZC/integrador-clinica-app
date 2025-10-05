import db from "../config/db.js";

export const crearMedico = async (medico) => {
  const { id_usuario, nombre, apellido, id_especialidad } = medico;
  const [result] = await db.query(
    "INSERT INTO medico (id_usuario, nombre, apellido, id_especialidad) VALUES (?, ?, ?, ?)",
    [id_usuario, nombre, apellido, id_especialidad]
  );
  return { id_medico: result.insertId, ...medico };
};

export const obtenerTurnosMedico = async (id_medico) => {
  const [rows] = await db.query(
    "SELECT * FROM turno WHERE id_medico = ?",
    [id_medico]
  );
  return rows;
};
