// src/routes/usuario.routes.js


//router crea rutas , solo trae las funciones ejemplo:
//traeme listarUsuario, crearUsuario y loginUsuario desde controllers
//validarUsuario es un middleware que revisa datos de entrada ,mailvalido,contraseña no vacia
//autenticarJWT comprueba si el usuario esta logueado mediante token JWT
//autorizarRol limita el acceso segun rol


import { Router } from "express";
import { listarUsuarios, crearUsuario, loginUsuario } from "../controllers/usuario.controller.js";
import { validarUsuario, validarLogin } from "../middleware/validaciones.js";
import { autenticarJWT, autorizarRol } from "../middleware/auth.js";

const router = Router();

// 🔹 Solo los admin pueden listar usuarios
router.get("/", autenticarJWT, autorizarRol(["admin"]), listarUsuarios);

// 🔹 Cualquier persona puede registrarse (crear usuario)
router.post("/", validarUsuario, crearUsuario);

// 🔹 Login de usuario (email + password)
router.post("/login", validarLogin, loginUsuario);


export default router;
