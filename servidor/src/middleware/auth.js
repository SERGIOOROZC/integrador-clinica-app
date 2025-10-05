import jwt from "jsonwebtoken";

const SECRET = "clave_secreta_123"; // ⚠️ poner en .env en producción

export const autenticarJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido" });
    }
    req.user = user;
    next();
  });
};

// autorizar solo al admin eliminar 
export const autorizarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ error: "No tenés permisos para realizar esta acción" });
    }
    next();
  };
};

export { SECRET };
