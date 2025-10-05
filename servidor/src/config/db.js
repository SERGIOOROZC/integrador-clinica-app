import mysql from "mysql2";

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "turnos_medicos"
});

// Verificar la conexión
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error de conexión a MySQL:", err.message);   
    } else {
        console.log("Conexión exitosa a MySQL");
        connection.release();
    }
});

// Exportar pool con promesas para usar async/await
const db = pool.promise();

export default db;
