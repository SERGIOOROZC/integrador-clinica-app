// src/services/apiServices.js

// 🔑 Configuración: URL base de tu backend
export const BASE_URL = 'http://localhost:3000';

// =========================================================
// FUNCIÓN AUXILIAR: Obtener Token
// =========================================================
const getToken = () => {
  return localStorage.getItem('token');
};

// =========================================================
// 1. AUTENTICACIÓN (LOGIN) - NO REQUIERE TOKEN
// =========================================================
export const loginAPI = async (credenciales) => {
  const url = `${BASE_URL}/usuario/login`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credenciales),
    });
    const body = await response.json();
    if (response.ok) {
      return body;
    } else {
      throw new Error(body.error || body.mensaje || "Credenciales incorrectas o error desconocido.");
    }
  } catch (error) {
    console.error("Error en loginAPI:", error);
    throw error;
  }
};

// =========================================================
// 2. USUARIOS / PACIENTES
// =========================================================
export const registrarUsuarioAPI = async (usuario) => {
  try {
    const url = `${BASE_URL}/usuario`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify(usuario)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error registrando usuario");
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const obtenerPacientesAPI = async () => {
  try {
    const url = `${BASE_URL}/paciente`;
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${getToken()}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al obtener pacientes");
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// =========================================================
// 3. MÉDICOS
// =========================================================
export const obtenerMedicosAPI = async () => {
  try {
    const url = `${BASE_URL}/medico`;
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${getToken()}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al obtener médicos");
    return data.medicos || data || [];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// =========================================================
// 4. TURNOS
// =========================================================
export const crearTurnoAPI = async (datosTurno) => {
  try {
    const url = `${BASE_URL}/turno`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify(datosTurno)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al crear turno");
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const obtenerTurnosAPI = async (filtros = {}) => {
  try {
    let query = new URLSearchParams(filtros).toString();
    const url = `${BASE_URL}/turno?${query}`;
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${getToken()}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al obtener turnos");
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// 💡 NUEVA FUNCIÓN: Actualizar un turno (usada para Confirmar)
export const actualizarTurnoAPI = async (id, datosActualizados) => {
    try {
        const url = `${BASE_URL}/turno/${id}`;
        // 🛠️ Usamos el método PUT, que es el estándar para reemplazar la data de un recurso.
        const response = await fetch(url, {
            method: "PUT", 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(datosActualizados)
        });
        const data = await response.json();
        // 🛑 Si el servidor no responde OK (200), lanzamos un error claro.
        if (!response.ok) throw new Error(data.error || "Error al actualizar turno");
        return data;
    } catch (err) {
        console.error("Error en actualizarTurnoAPI:", err);
        throw err;
    }
};

// 💡 NUEVA FUNCIÓN: Eliminar un turno (la centralizamos aquí)
export const eliminarTurnoAPI = async (id) => {
    try {
        const url = `${BASE_URL}/turno/${id}`;
        // 🗑️ Usamos el método DELETE, el estándar para borrar un recurso.
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        });
        // ⚠️ Nota: A veces, un DELETE exitoso no devuelve un JSON, por eso revisamos 'response.ok'.
        if (!response.ok) {
             const data = await response.json(); // Intentamos leer el error
             throw new Error(data.error || "Error al eliminar turno");
        }
        // Si todo salió bien, devolvemos un mensaje de éxito.
        return { mensaje: `Turno ${id} eliminado correctamente` };
    } catch (err) {
        console.error("Error en eliminarTurnoAPI:", err);
        throw err;
    }
};

// =========================================================
// 5. ESPECIALIDADES
// =========================================================
export const obtenerEspecialidadesAPI = async () => {
  try {
    const url = `${BASE_URL}/especialidad`;
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${getToken()}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al obtener especialidades");
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const crearEspecialidadAPI = async (nombre) => {
  try {
    const url = `${BASE_URL}/especialidad`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify({ nombre })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al crear especialidad");
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const actualizarEspecialidadAPI = async (id, nombre) => {
  try {
    const url = `${BASE_URL}/especialidad/${id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify({ nombre })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al actualizar especialidad");
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const eliminarEspecialidadAPI = async (id) => {
  try {
    const url = `${BASE_URL}/especialidad/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${getToken()}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al eliminar especialidad");
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
