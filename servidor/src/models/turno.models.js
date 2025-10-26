import db from "../config/db.js";

/**
 * Modelo: obtenerTurnos
 * - Realiza JOINs para devolver datos enriquecidos (nombre paciente, nombre medico, especialidad).
 * - Acepta filtros opcionales: { id_medico, id_paciente }
 * - Devuelve un array de objetos con las propiedades:
 * { id_turno, fecha, hora, estado, observaciones, id_medico, medico, especialidad, id_paciente, paciente }
 */
export const obtenerTurnos = async (filtros = {}) => {
  let query = `
    SELECT 
      t.id_turno,
      t.fecha,
      t.hora,
      t.estado,
      t.observaciones,

      -- MEDICO (alias 'medico')
      m.id_medico,
      CONCAT(um.nombre, ' ', um.apellido) AS medico,

      -- ESPECIALIDAD (alias 'especialidad')
      e.id_especialidad,
      e.nombre AS especialidad,

      -- PACIENTE (alias 'paciente')
      p.id_paciente,
      CONCAT(up.nombre, ' ', up.apellido) AS paciente

    FROM turno t
    JOIN medico m ON t.id_medico = m.id_medico
    JOIN usuario um ON m.id_usuario = um.id_usuario
    LEFT JOIN especialidad e ON m.id_especialidad = e.id_especialidad
    LEFT JOIN paciente p ON t.id_paciente = p.id_paciente
    LEFT JOIN usuario up ON p.id_usuario = up.id_usuario
    WHERE 1 = 1
  `;

  const valores = [];

  if (filtros.id_medico) {
    query += " AND t.id_medico = ?";
    valores.push(filtros.id_medico);
  }

  if (filtros.id_paciente) {
    query += " AND t.id_paciente = ?";
    valores.push(filtros.id_paciente);
  }

  // Orden por fecha/hora para UX
  query += " ORDER BY t.fecha, t.hora";

  try {
    const [rows] = await db.query(query, valores);
    return rows;
  } catch (error) {
    console.error("Error en obtenerTurnos:", error);
    throw error;
  }
};

/**
 * Modelo: crearTurno
 * - Inserta un nuevo turno en la tabla 'turno'.
 * - Mapea 'motivo' -> 'observaciones'.
 * - Forzar 'estado' desde el controlador.
 * - Devuelve un objeto representando el nuevo turno.
 */
export const crearTurno = async (turno) => {
  const { id_paciente, id_medico, fecha, hora, estado, motivo } = turno;
  const observaciones_valor = motivo ?? null;

  try {
    const [result] = await db.query(
      `INSERT INTO turno (id_paciente, id_medico, fecha, hora, estado, observaciones)
        VALUES (?, ?, ?, ?, ?, ?)`,
      [id_paciente, id_medico, fecha, hora, estado, observaciones_valor]
    );

    return {
      id_turno: result.insertId,
      id_paciente,
      id_medico,
      fecha,
      hora,
      estado,
      observaciones: observaciones_valor,
    };
  } catch (error) {
    console.error("--- ERROR CREAR TURNO ---", error);
    throw new Error("Fallo en la inserción de la base de datos.");
  }
};

/**
 * Modelo: eliminarTurno
 * - Borra un turno por id_turno.
 * - Devuelve mensaje o lanza error si no existe.
 */
export const eliminarTurno = async (id_turno) => {
  try {
    const [result] = await db.query("DELETE FROM turno WHERE id_turno = ?", [id_turno]);
    if (result.affectedRows === 0) {
      throw new Error("NoEncontrado: No se encontró el turno para eliminar"); 
    }
    return { mensaje: "Turno eliminado" };
  } catch (error) {
    console.error("Error al eliminar turno:", error);
    throw error;
  }
};

/**
 * Modelo: actualizarTurno
 * - Actualiza campos presentes en el objeto 'turno'.
 * - Devuelve el turno completo con JOINs para frontend.
 */
export const actualizarTurno = async (id_turno, turno = {}) => {
  const camposPermitidos = ["id_paciente", "id_medico", "fecha", "hora", "estado", "observaciones"];
  const setParts = [];
  const valores = [];

  for (const campo of camposPermitidos) {
    if (Object.prototype.hasOwnProperty.call(turno, campo)) {
      setParts.push(`${campo} = ?`);
      valores.push(turno[campo]);
    }
  }

  // X     setParts.push("fecha_modificacion = NOW()");

  if (setParts.length === 0) {
    throw new Error("No se proporcionaron campos válidos para actualizar");
  }

  const sqlUpdate = `UPDATE turno SET ${setParts.join(", ")} WHERE id_turno = ?`;
  valores.push(id_turno);

  try {
    const [result] = await db.query(sqlUpdate, valores);

    if (result.affectedRows === 0) {
      throw new Error("NoEncontrado: No se encontró el turno para actualizar");
    }

    // 🔹 Retornamos el turno completo con JOINs
    const sqlSelect = `
      SELECT 
        t.id_turno,
        t.fecha,
        t.hora,
        t.estado,
        t.observaciones,
        m.id_medico,
        CONCAT(um.nombre, ' ', um.apellido) AS medico,
        e.id_especialidad,
        e.nombre AS especialidad,
        p.id_paciente,
        CONCAT(up.nombre, ' ', up.apellido) AS paciente
      FROM turno t
      JOIN medico m ON t.id_medico = m.id_medico
      JOIN usuario um ON m.id_usuario = um.id_usuario
      LEFT JOIN especialidad e ON m.id_especialidad = e.id_especialidad
      LEFT JOIN paciente p ON t.id_paciente = p.id_paciente
      LEFT JOIN usuario up ON p.id_usuario = up.id_usuario
      WHERE t.id_turno = ?
    `;
    const [rows] = await db.query(sqlSelect, [id_turno]);

    return rows[0];
  } catch (error) {
    console.error("Error al actualizar turno:", error);
    throw error;
  }
};

/**
 * Modelo: verificarDisponibilidad
 * - Retorna true si ya existe un turno para ese médico/fecha/hora con estado Pendiente o Confirmado.
 */
export const verificarDisponibilidad = async (id_medico, fecha, hora) => {
  try {
    const query = `
      SELECT COUNT(*) AS count
      FROM turno
      WHERE id_medico = ?
        AND fecha = ?
        AND hora = ?
        AND estado IN ('Pendiente', 'Confirmado')
    `;
    const [rows] = await db.query(query, [id_medico, fecha, hora]);
    return rows[0].count > 0;
  } catch (error) {
    console.error("Error en verificarDisponibilidad:", error);
    throw error;
  }
};
