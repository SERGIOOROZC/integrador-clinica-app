import jwt from "jsonwebtoken";
// 🚨 CRÍTICO: Necesario para usar jwt.verify con async/await
import { promisify } from "util"; 

// 1. Convertimos jwt.verify en una función que devuelve una Promesa
const verifyAsync = promisify(jwt.verify); 


// ⚠️ CRÍTICO 1: ... (Tu comentario original)
export const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
    console.error("FATAL ERROR: JWT_SECRET no está definido en .env");
    process.exit(1);
}

// -----------------------------------------------------------
// 🔹 1. Middleware de Autenticación JWT (CORREGIDO CON ASYNC/AWAIT)
// -----------------------------------------------------------
export const autenticarJWT = async (req, res, next) => { // ⬅️ Hacemos la función ASÍNCRONA
    
    const authHeader = req.headers["authorization"];

    // 🚨 DEBUG 1 y 2 (Logs originales)
    console.log("--- DEBUG JWT MIDDLEWARE ---");
    console.log("Clave Secreta Usada (SECRET):", SECRET); 
    console.log("Header 'Authorization' completo:", authHeader);
    
    // 1. Chequea si existe el encabezado
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Token requerido o formato inválido (debe ser Bearer <token>)" });
    }

    // 2. Extraemos el token puro
    const token = authHeader.split(" ")[1];
    console.log("Token recibido (Puro):", token); 
    console.log("----------------------------");

    try {
        // 3. Verificamos el token: USAMOS AWAIT para forzar a Express a ESPERAR el resultado.
        // Esto garantiza que req.user se asigna antes de que el flujo pase a autorizarRol.
        const user = await verifyAsync(token, SECRET);
        
        // Si la verificación es exitosa:
        console.log("✅ Token verificado exitosamente. Usuario:", user.id_usuario);
        req.user = user;
        next(); // Continúa al siguiente middleware (autorizarRol)

    } catch (err) {
        // Manejo de errores de JWT (expirado, inválido, etc.)
        console.error("Fallo de Verificación JWT:", err.message); 
        return res.status(403).json({ error: "Token inválido o expirado." });
    }
};

// -----------------------------------------------------------
// 🔹 2. Middleware de Autorización por Rol (Se mantiene sin cambios)
// -----------------------------------------------------------
export const autorizarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        // req.user AHORA SÍ estará disponible porque autenticarJWT usó 'await'.
        if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
            // Este error 403 solo debería ocurrir ahora si el rol realmente NO tiene permiso.
            return res.status(403).json({ error: "No tenés permisos para realizar esta acción" });
        }
        next();
    };
};