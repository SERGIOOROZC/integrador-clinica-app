//import { Router } from "express"; //Creás un router (un objeto especial de Express) donde vas a ir 
// registrando las rutas relacionadas con "turnos".
//import { listarTurnos, nuevoTurno, borrarTurno } from "../controllers/turno.controller.js";

//const router = Router();

//B. que acciones?
//no hay logica si viene un GET mandalo a listarTurnos 

//router.get("/", listarTurnos);         //dame todos los turnos
//router.post("/", nuevoTurno);          //crear un nuevo turno
//router.delete("/:id", borrarTurno);    //borrar turno

//export default router; //para que lo use app.js

// console.log(router); esto fue para ver el objeto por terminal


import { Router } from "express";
import {
  listarTurnos,
  nuevoTurno,
  borrarTurno,
  actualizarTurno
} from "../controllers/turno.controller.js";
import { validarTurno } from "../middleware/validaciones.js";
import { autenticarJWT, autorizarRol } from "../middleware/auth.js";


const router = Router();


// 🔹 Listar turnos
// Admin ve todos, médico ve sus turnos, paciente ve sus propios turnos
router.get("/", autenticarJWT, autorizarRol(["admin", "medico", "paciente"]), listarTurnos);

// 🔹 Crear turno
// Solo admin o médico pueden crear turnos
router.post("/", autenticarJWT, autorizarRol(["admin", "medico"]), validarTurno, nuevoTurno);

// 🔹 Borrar turno
// Solo admin o médico pueden borrar
router.delete("/:id", autenticarJWT, autorizarRol(["admin", "medico"]), borrarTurno);


// 🔹 4. Editar/Actualizar turno (PUT)
// Solo admin o médico pueden editar. Requiere autenticación y validación.
router.put("/:id", autenticarJWT, autorizarRol(["admin", "medico"]), validarTurno, actualizarTurno);

export default router;
