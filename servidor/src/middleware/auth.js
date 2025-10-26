import jwt from "jsonwebtoken";

// ⚠️ CRÍTICO 1: Esta variable se carga UNA SOLA VEZ al iniciar el servidor.
// Asegúrate de que en tu archivo principal (ej. index.js/server.js)
// la línea para cargar .env (import 'dotenv/config'; o require('dotenv').config();)
// se ejecute ANTES de que se importe este archivo.
export const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
    // Detiene la app si olvidaste poner JWT_SECRET en .env
    console.error("FATAL ERROR: JWT_SECRET no está definido en .env");
    process.exit(1);
}

// -----------------------------------------------------------
// 🔹 1. Middleware de Autenticación JWT
// -----------------------------------------------------------
export const autenticarJWT = (req, res, next) => {
    
    const authHeader = req.headers["authorization"];

    // 🚨 DEBUG 1 (CLAVE): Muestra el secreto que se intentará usar para la verificación.
    console.log("--- DEBUG JWT MIDDLEWARE ---");
    console.log("Clave Secreta Usada (SECRET):", SECRET); 
    console.log("Header 'Authorization' completo:", authHeader);
    
    // 1. Chequea si existe el encabezado
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Error 401: No hay encabezado Authorization o tiene formato incorrecto
        return res.status(401).json({ error: "Token requerido o formato inválido (debe ser Bearer <token>)" });
    }

    // 2. Extraemos el token puro, eliminando "Bearer "
    const token = authHeader.split(" ")[1];
    
    // 🚨 DEBUG 2 (CLAVE): Muestra el token recibido del Front-end.
    console.log("Token recibido (Puro):", token); 
    console.log("----------------------------");

    // 3. Verificamos el token
    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            // 🚨 DEBUG 3 (CLAVE): Si hay un error, se imprime el mensaje exacto
            // que indica por qué falló (ej. 'jwt expired' o 'invalid signature').
            console.error("Fallo de Verificación JWT:", err.message); 
            
            // Error 403: Token inválido/prohibido (Aquí se produce el error 403)
            return res.status(403).json({ error: "Token inválido o expirado." });
        }
        
        // Si la verificación es exitosa:
        console.log("✅ Token verificado exitosamente. Usuario:", user.id_usuario);
        req.user = user;
        next(); // Continúa al controlador
    });
};

// -----------------------------------------------------------
// 🔹 2. Middleware de Autorización por Rol (Opcional)
// -----------------------------------------------------------
export const autorizarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        // req.user ya está disponible gracias a autenticarJWT
        if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ error: "No tenés permisos para realizar esta acción" });
        }
        next();
    };
};