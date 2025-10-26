// src/controllers/usuario.controller.js (VERSION CORREGIDA Y ROBUSTA)

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

// 💡 Función auxiliar para generar JWT (se mantiene)
const generarJWT = (usuario) => {
    return jwt.sign(
        { id_usuario: usuario.id_usuario, rol: usuario.rol },
        SECRET,
        { expiresIn: "1h" }
    );
};

// 🔹 LISTAR USUARIOS (se mantiene)
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

// 🔹 REGISTRO DE USUARIO (CORRECCIÓN CRÍTICA APLICADA)
export const crearUsuario = async (req, res) => {
    let usuarioCreado = null;
    let idUsuarioNuevo = null;
    
    try {
        // 1️⃣ Solo recibimos los campos de REGISTRO
        const { 
            nombre, apellido, email, password, 
            rol = 'paciente' 
        } = req.body; 
        
        // 1️⃣ Verificar si el email ya existe
        const existing = await obtenerUsuarioPorEmail(email);
        if (existing)
            return res.status(400).json({ error: "El email ya está registrado" });

        // 2️⃣ Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        const rolActual = rol.toLowerCase();

        // 3️⃣ Crear usuario base
        usuarioCreado = await crearUsuarioModel({
            nombre, apellido, email, password: hashedPassword, rol: rolActual, 
        });

        // 🔑 Obtenemos el ID de la inserción.
        idUsuarioNuevo = usuarioCreado.id_usuario; 
        
        // Mecanismo de fallback (común en MySQL/mysql2)
        if (!idUsuarioNuevo && usuarioCreado.insertId) {
            idUsuarioNuevo = usuarioCreado.insertId;
        }

        if (!idUsuarioNuevo) {
           throw new Error("Fallo al obtener el ID de usuario recién creado del modelo.");
        }
        
        let perfilCreado = null;
        
        // 4️⃣ Crear perfil con valores de RELLENO (SOLUCIÓN al error NOT NULL)
        if (rolActual === 'medico') {
            // Se asume que estos campos aceptan NULL
            perfilCreado = await crearMedico({ 
                id_usuario: idUsuarioNuevo, 
                especialidad: null, 
                matricula: null 
            });
            
        } else if (rolActual === 'paciente') {
            // 🚨 SOLUCIÓN CRÍTICA: Usamos valores que la DB acepta para evitar el error 'cannot be null' 🚨
            perfilCreado = await crearPaciente({ 
                id_usuario: idUsuarioNuevo, 
                dni: '0',            // Valor de relleno de string
                telefono: '0',       // Valor de relleno de string
                edad: 0,             // Valor de relleno numérico (SOLUCIONA 'edad' cannot be null)
                id_responsable: null, // Acepta NULL
                direccion: null,      // Acepta NULL
            });
        }

        // 5️⃣ Generar token JWT
        if (!usuarioCreado.id_usuario) {
            usuarioCreado.id_usuario = idUsuarioNuevo;
        }

        const token = generarJWT(usuarioCreado);

        // 6️⃣ Enviar respuesta exitosa con el token
        res.status(201).json({
            mensaje: "Registro exitoso",
            token, 
            usuario: { 
                id_usuario: idUsuarioNuevo,
                nombre: usuarioCreado.nombre,
                rol: usuarioCreado.rol
            },
        });
        
    } catch (error) {
        // ❌ LIMPIEZA: Rollback si el usuario se creó pero el perfil falló.
        if (idUsuarioNuevo) {
            try {
                await eliminarUsuarioModel(idUsuarioNuevo);
                console.log(`Usuario ${idUsuarioNuevo} eliminado por fallo en la creación del perfil.`);
            } catch (cleanupError) {
                console.error("Fallo al limpiar el usuario:", cleanupError);
            }
        }
        console.error("Error al crear usuario y perfil:", error.message, error);
        // Devolvemos un mensaje de error limpio al FrontEnd
        res.status(500).json({ error: "Error interno en el servidor al crear usuario. " + error.message });
    }
};

// 🔹 Eliminar usuario (se mantiene)
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

// 🔹 LOGIN DE USUARIO (se mantiene)
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
        const token = generarJWT(usuario);

        // 4️⃣ Determinar si el perfil está completo
        const perfil_completo = usuario.perfil_paciente_completo || (usuario.rol !== "paciente");

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