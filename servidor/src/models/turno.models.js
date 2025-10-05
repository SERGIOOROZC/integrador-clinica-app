import db from "../config/db.js";

// 🔹 1. Obtener Turnos (con JOIN para nombres y especialidad)
export const obtenerTurnos = async (filtros = {}) => {
    
    // 🔍 Consulta SQL con múltiples JOINs para enriquecer los datos
    // Trazamos la ruta: Turno -> (Medico/Paciente) -> Usuario (para el nombre)
    let query = `
        SELECT 
            t.id_turno,
            t.fecha,
            t.hora,
            t.estado,
            t.observaciones,
            
            -- Información del MÉDICO (tomando el nombre de la tabla usuario)
            m.id_medico,
            CONCAT(um.nombre, ' ', um.apellido) AS nombre_medico,
            e.nombre AS especialidad_nombre, 
            
            -- Información del PACIENTE (tomando el nombre de la tabla usuario)
            p.id_paciente,
            CONCAT(up.nombre, ' ', up.apellido) AS nombre_paciente
            
        FROM turno t
        
        -- UNIÓN 1: Turno se une a Medico
        JOIN medico m ON t.id_medico = m.id_medico
        
        -- UNIÓN 2: Medico se une a Usuario (para obtener nombre del Médico)
        JOIN usuario um ON m.id_usuario = um.id_usuario

        -- UNIÓN 3: Medico se une a Especialidad (para obtener el nombre de la Especialidad)
        JOIN especialidad e ON m.id_especialidad = e.id_especialidad
        
        -- UNIÓN 4: Turno se une a Paciente
        LEFT JOIN paciente p ON t.id_paciente = p.id_paciente
        
        -- UNIÓN 5: Paciente se une a Usuario (para obtener nombre del Paciente)
        LEFT JOIN usuario up ON p.id_usuario = up.id_usuario
        
        WHERE 1 = 1 
    `;
    
    const valores = [];

    // 🛡️ Filtros de Seguridad (para que cada rol vea solo sus datos)
    if (filtros.id_medico) {
        query += ' AND t.id_medico = ?';
        valores.push(filtros.id_medico);
    } else if (filtros.id_paciente) {
        query += ' AND t.id_paciente = ?';
        valores.push(filtros.id_paciente);
    }
    
    query += ' ORDER BY t.fecha, t.hora'; // Ordenamos para una mejor visualización

    try {
        const [rows] = await db.query(query, valores);
        // Devolvemos objetos enriquecidos con nombres y especialidad
        return rows;
    } catch (error) {
        console.error("Error en obtenerTurnos con JOIN:", error);
        throw error;
    }
};

// 🔹 2. Crear turno
export const crearTurno = async (turno) => {
  const { id_paciente, id_medico, fecha, hora, estado, observaciones } = turno;
  const [result] = await db.query(
    "INSERT INTO turno (id_paciente, id_medico, fecha, hora, estado, observaciones) VALUES (?, ?, ?, ?, ?, ?)",
    [id_paciente, id_medico, fecha, hora, estado, observaciones]
  );
  return { id_turno: result.insertId, ...turno };
};

// 🔹 3. Eliminar turno
export const eliminarTurno = async (id_turno) => {
    try {
        const [result] = await db.query("DELETE FROM turno WHERE id_turno = ?", [id_turno]);
        if (result.affectedRows === 0) {
            throw new Error("No se encontró el turno para eliminar");
        }
        return { mensaje: "Turno eliminado" };
    } catch (error) {
        console.error("Error al eliminar turno:", error);
        throw error;
    }
};

// 🔹 4. Actualizar turno
export const actualizarTurno = async (id_turno, turno) => {
    const { id_paciente, id_medico, fecha, hora, estado, observaciones } = turno;
    
    // Sentencia SQL: UPDATE
    const [result] = await db.query(
        "UPDATE turno SET id_paciente = ?, id_medico = ?, fecha = ?, hora = ?, estado = ?, observaciones = ? WHERE id_turno = ?",
        [id_paciente, id_medico, fecha, hora, estado, observaciones, id_turno] // Valores en orden
    );

    if (result.affectedRows === 0) {
        throw new Error("No se encontró el turno para actualizar");
    }
    
    // Devuelvo el objeto actualizado para confirmación
    return { id_turno, ...turno };
};