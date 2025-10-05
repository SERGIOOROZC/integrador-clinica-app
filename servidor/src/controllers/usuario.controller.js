// src/controllers/usuario.controller.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET } from "../middleware/auth.js";
import { crearUsuarioModel, listarUsuariosModel, obtenerUsuarioPorEmail } from "../models/usuario.models.js";

// 🔹 LISTAR USUARIOS (solo para admin)
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

// 🔹 CREAR USUARIO (Registro desde SignUp.jsx)
export const crearUsuario = async (req, res) => {
  try {
    // 💡 AJUSTE CLAVE: Asignamos 'null' por defecto a id_especialidad 
    // y manejamos los demás campos. Esto evita el error 400 cuando un usuario
    // normal se registra (ya que no envía id_especialidad).
    const { 
      nombre, 
      apellido, 
      email, 
      password, 
      rol, 
      id_especialidad = null 
    } = req.body;

    // 1️⃣ Verificar si el email ya existe
    const existing = await obtenerUsuarioPorEmail(email);
    if (existing) return res.status(400).json({ error: "El email ya está registrado" });

    // 2️⃣ Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Crear usuario usando el modelo
    const usuarioCreado = await crearUsuarioModel({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      rol,
      id_especialidad, // Si fue nulo en req.body, se envía null al modelo.
    });

    // 4️⃣ Mensaje según rol
    res.status(201).json({
      mensaje: rol === "medico" ? "Médico registrado exitosamente" : "Usuario creado exitosamente",
      usuario: usuarioCreado,
    });

  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

// 🔑 LOGIN DE USUARIO (SignIn.jsx)
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Buscar usuario por email
    const usuario = await obtenerUsuarioPorEmail(email);
    if (!usuario) return res.status(401).json({ error: "Credenciales inválidas" });

    // 2️⃣ Verificar contraseña
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) return res.status(401).json({ error: "Credenciales inválidas" });

    // 3️⃣ Generar token JWT
    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.rol },
      SECRET,
      { expiresIn: "1h" }
    );

    // 4️⃣ Respuesta al frontend
    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
      },
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en el login" });
  }
};