// src/models/usuario.models.js
import db from "../config/db.js";

// 🔹 LISTAR USUARIOS (solo admin)
export const listarUsuariosModel = async () => {
  const [usuarios] = await db.query(
    `SELECT 
       u.id_usuario, 
       u.nombre, 
       u.apellido, 
       u.email, 
       u.rol,
       p.id_paciente,
       p.edad,
       p.dni,
       p.telefono,
       p.direccion
     FROM usuario u
     LEFT JOIN paciente p ON u.id_usuario = p.id_usuario`
  );
  return usuarios;
};

// 🔹 CREAR USUARIO (solo tabla 'usuario')
export const crearUsuarioModel = async ({ nombre, apellido, email, password, rol }) => {
  const [result] = await db.query(
    "INSERT INTO usuario (nombre, apellido, email, password, rol) VALUES (?, ?, ?, ?, ?)",
    [nombre, apellido, email, password, rol || "paciente"]
  );

  const id_usuario = result.insertId;

  return { id_usuario, nombre, apellido, email, rol: rol || "paciente" };
};

// 🔑 OBTENER USUARIO POR EMAIL (para login)
export const obtenerUsuarioPorEmail = async (email) => {
  const [rows] = await db.query(
    `SELECT 
       u.id_usuario, 
       u.nombre, 
       u.apellido, 
       u.email, 
       u.password, 
       u.rol,
       CASE 
         WHEN p.id_paciente IS NOT NULL 
              AND p.dni IS NOT NULL 
              AND p.telefono IS NOT NULL 
              AND p.direccion IS NOT NULL 
         THEN TRUE ELSE FALSE 
       END AS perfil_paciente_completo,
       p.id_paciente,
       p.edad,
       p.dni,
       p.telefono,
       p.direccion
     FROM usuario u
     LEFT JOIN paciente p ON u.id_usuario = p.id_usuario
     WHERE u.email = ?`,
    [email]
  );
  return rows[0];
};

// 🔹 ELIMINAR USUARIO Y SU PERFIL
export const eliminarUsuarioModel = async (id_usuario) => {
  try {
    // 1️⃣ Borrar paciente primero
    await db.query("DELETE FROM paciente WHERE id_usuario = ?", [id_usuario]);

    // 2️⃣ Borrar usuario
    const [result] = await db.query(
      "DELETE FROM usuario WHERE id_usuario = ?",
      [id_usuario]
    );

    return result; // result.affectedRows > 0 si se eliminó
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};
