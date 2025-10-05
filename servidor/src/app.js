//importo modulos - app.js tiene la configuracion general
// 1 express para crear el servidor
// 2 db.js para la conexion a base de datos
// 3 archivos de rutas -

import express from 'express';
import db from './config/db.js';
import usuarioRoutes from './routes/usuario.routes.js';
import pacienteRoutes from './routes/paciente.routes.js';
import medicoRoutes from './routes/medico.routes.js';
import turnoRoutes from './routes/turno.routes.js';
import loginRoutes from './routes/login.routes.js';
import cors from "cors";



const app = express();                // 4 Primero declarás "app" para inicializar el servidor.
const PORT = 3000;
app.use(cors({
  origin: "http://localhost:5173"
}));

// lo uso - tipos de datos que puedo recibir
app.use(express.json());                         // 5 Middleware para JSON permite recibir datos json en las peticiones
app.use(express.text());                         // si llega peticion en texto plano
app.use(express.urlencoded({extended:true}));    //datos en formato formulario html 

// A. Le dice a Express: “Si llega una petición y entra en /usuario, envíala al router turnoRoutes para que ahí busque la ruta y las acciones.”
// turnoRoutes NO es una función "normal", es un archivo que exporta un objeto Router de Express.
//  Eso significa que turnoRoutes es un objeto Router de Express con sus rutas cargadas (las que definiste en turno.routes.js).
app.use('/usuario', usuarioRoutes);  
app.use('/paciente', pacienteRoutes);
app.use('/medico', medicoRoutes);
app.use('/turno', turnoRoutes);
app.use('/login', loginRoutes); // La ruta sería: POST /login


app.use(function(req, res) {
  res.status(404).send("has ingresado una URL sin procesamiento");
});




// Ruta para verificar conexión
app.get('/ping-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS resultado');
    res.json({ mensaje: 'Conexión OK', resultado: rows[0].resultado });
  } catch (error) {
    console.error('Error al consultar:', error);
    res.status(500).json({ error: 'Error en la consulta' });
  }
});

// Este GET ya no es necesario si usás usuario.routes.js
// app.get('/usuarios', ...) → se reemplaza por el router

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});




