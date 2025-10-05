// src/routes/login.routes.js

import { Router } from "express";
// 🔑 Importamos la función de lógica que está en el Controller
import { loginUsuario } from "../controllers/usuario.controller.js"; 

const router = Router();

// El Router SOLO define el endpoint y llama a la lógica del Controller.
//dispara la funcion loginUsuario. aca verificar el usuario y crear el token '.
router.post("/login", loginUsuario); 

export default router;