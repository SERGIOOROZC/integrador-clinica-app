// src/controllers/usuario.controller.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET } from "../middleware/auth.js";
import db from "../config/db.js"; 
import {
  crearUsuarioModel,
  listarUsuariosModel,
  obtenerUsuarioPorEmail,
  eliminarUsuarioModel
} from "../models/usuario.models.js";
import { crearPaciente } from "../models/paciente.models.js"; 
import { crearMedico } from "../models/medico.models.js"; 

// 🔹 LISTAR USUARIOS (Solo Admin)
export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await listarUsuariosModel();
    res.json({
      mensaje: "Lista de usuarios obtenida correctamente",
      usuarios,
    });
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ error: "Error al listar usuarios" });
  }
};

// 🔹 REGISTRO DE USUARIO
export const crearUsuario = async (req, res) => {
  try {
    const { 
      nombre, apellido, email, password, 
      rol = 'paciente', especialidad, 
      edad, dni, telefono 
    } = req.body; 

    // 1️⃣ Verificar si el email ya existe
    const existing = await obtenerUsuarioPorEmail(email);
    if (existing)
      return res.status(400).json({ error: "El email ya está registrado" });

    // 2️⃣ Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Crear usuario base
    const usuarioCreado = await crearUsuarioModel({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      rol: rol.toLowerCase(), 
    });

    const idUsuarioNuevo = usuarioCreado.id_usuario;
    let perfilCreado = null;
    let mensaje = "Usuario creado exitosamente";
    const rolActual = rol.toLowerCase();

    // 4️⃣ Crear perfil según rol
    if (rolActual === 'medico') {
      if (!especialidad) {
        return res.status(400).json({ error: "La especialidad es requerida para el médico." });
      }

      perfilCreado = await crearMedico({ 
        id_usuario: idUsuarioNuevo, 
        nombre, 
        apellido, 
        especialidad 
      });
      mensaje = "Médico registrado exitosamente";
      
    } else if (rolActual === 'paciente') {
      // Si falta info, se puede completar después desde CompletarPerfil.jsx
      perfilCreado = await crearPaciente({ 
        id_usuario: idUsuarioNuevo, 
        edad: edad || null,
        dni: dni || null,
        telefono: telefono || null
      });
      mensaje = "Paciente registrado exitosamente";
    }

    res.status(201).json({
      mensaje,
      usuario: usuarioCreado,
      perfil: perfilCreado,
    });
    
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error al crear usuario y perfil." });
  }
};

// 🔹 Eliminar usuario (solo admin)
export const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await eliminarUsuarioModel(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

// 🔹 LOGIN DE USUARIO
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Buscar usuario
    const usuario = await obtenerUsuarioPorEmail(email);
    if (!usuario)
      return res.status(401).json({ error: "Credenciales inválidas" });

    // 2️⃣ Verificar contraseña
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida)
      return res.status(401).json({ error: "Credenciales inválidas" });

    // 3️⃣ Generar token JWT
    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, rol: usuario.rol },
      SECRET,
      { expiresIn: "1h" }
    );

    // 4️⃣ Verificar si el paciente tiene perfil completo
    let perfil_completo = true; // nombre igual que frontend
    if (usuario.rol === "paciente") {
      const [rows] = await db.query(
        "SELECT dni, telefono, edad FROM paciente WHERE id_usuario = ?",
        [usuario.id_usuario]
      );

      if (!rows.length || !rows[0].dni || !rows[0].telefono || !rows[0].edad) {
        perfil_completo = false;
      }
    }

    // 5️⃣ Enviar respuesta
    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        perfil_completo, // ✅ para el frontend
      },
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en el login" });
  }
};
