// src/models/usuario.model.js
import db from "../config/db.js";

// 🔹 LISTAR USUARIOS (solo para admin)
export const listarUsuariosModel = async () => {
  const [usuarios] = await db.query(
    "SELECT id_usuario, nombre, apellido, email, rol FROM usuario"
  );
  return usuarios;
};

// 🔹 CREAR USUARIO (para pacientes o médicos)
export const crearUsuarioModel = async ({ nombre, apellido, email, password, rol, id_especialidad }) => {
  // Insertar en tabla usuario
  const [result] = await db.query(
    "INSERT INTO usuario (nombre, apellido, email, password, rol) VALUES (?, ?, ?, ?, ?)",
    [nombre, apellido, email, password, rol || "paciente"]
  );

  const id_usuario = result.insertId;

  // Si el usuario es medico, insertar en tabla medico
  if (rol === "medico") {
    await db.query(
      "INSERT INTO medico (id_usuario, nombre, apellido, id_especialidad) VALUES (?, ?, ?, ?)",
      [id_usuario, nombre, apellido, id_especialidad]
    );
  }

  return { id_usuario, nombre, apellido, email, rol: rol || "paciente" };
};

// 🔑 OBTENER USUARIO POR EMAIL (para login)
export const obtenerUsuarioPorEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT id_usuario, nombre, apellido, email, password, rol FROM usuario WHERE email = ?",
    [email]
  );
  return rows[0]; // retorna el usuario o undefined
};
