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
// FUNCIÓN AUXILIAR: Manejo robusto de errores de API
// =========================================================
/**
 * Procesa la respuesta de la API (response) para extraer el mensaje de error.
 * @param {Response} response - Objeto Response de la API.
 * @param {string} defaultMessage - Mensaje genérico a usar si no se encuentra un error específico.
 * @returns {Error} Una nueva instancia de Error con el mensaje extraído.
 */
const handleErrorResponse = async (response, defaultMessage) => {
    // Intentamos leer el JSON. Si el body está vacío o no es JSON, devolvemos objeto vacío.
    const data = await response.json().catch(() => ({}));
    
    // Búsqueda robusta del mensaje de error en diferentes estructuras del backend
    const errorMessage = data.error || 
                         data.mensaje ||
                         (data.errors && data.errors[0] && data.errors[0].msg) ||
                         `${defaultMessage} (Error ${response.status})`;

    // Logueamos la respuesta completa del servidor para debugging
    console.error("Respuesta fallida del servidor:", response.status, data);
    
    throw new Error(errorMessage);
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
    // Aquí no usamos handleErrorResponse porque queremos manejar la respuesta para el login específico
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
        // ✅ CORREGIDO: No se requiere Authorization para el registro.
      },
      body: JSON.stringify(usuario)
    });
    
    if (!response.ok) {
      return await handleErrorResponse(response, "Error al registrar usuario");
    }
    return response.json();
    
  } catch (err) {
    console.error("Error en registrarUsuarioAPI:", err);
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
    if (!response.ok) {
      return await handleErrorResponse(response, "Error al obtener pacientes");
    }
    return response.json();
  } catch (err) {
    console.error("Error en obtenerPacientesAPI:", err);
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
    if (!response.ok) {
        // En obtención, devolvemos el error específico
        throw new Error(data.error || "Error al obtener médicos");
    }
    return data.medicos || data || [];
  } catch (err) {
    console.error("Error en obtenerMedicosAPI:", err);
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
    if (!response.ok) {
      return await handleErrorResponse(response, "Error al crear turno");
    }
    return response.json();
  } catch (err) {
    console.error("Error en crearTurnoAPI:", err);
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
    if (!response.ok) {
      return await handleErrorResponse(response, "Error al obtener turnos");
    }
    return response.json();
  } catch (err) {
    console.error("Error en obtenerTurnosAPI:", err);
    throw err;
  }
};

// 💡 FUNCIÓN: Actualizar un turno (usada para Confirmar) - MANEJO DE ERRORES MEJORADO
export const actualizarTurnoAPI = async (id, datosActualizados) => {
  try {
    const url = `${BASE_URL}/turno/${id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify(datosActualizados)
    });
    
    if (!response.ok) {
        // ✅ AHORA DEVOLVERÁ EL MENSAJE ESPECÍFICO DEL ERROR 400
        return await handleErrorResponse(response, "Error al actualizar turno");
    }

    return response.json();
  } catch (err) {
    console.error("Error en actualizarTurnoAPI:", err);
    throw err;
  }
};

// 💡 FUNCIÓN: Eliminar un turno 
export const eliminarTurnoAPI = async (id) => {
  try {
    const url = `${BASE_URL}/turno/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${getToken()}`
      }
    });
    
    // Un DELETE exitoso a menudo devuelve 204 No Content, pero revisamos si no fue OK
    if (!response.ok) {
      return await handleErrorResponse(response, "Error al eliminar turno");
    }
    
    // Si no hay contenido (204), devolvemos un mensaje de éxito manualmente.
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
    if (!response.ok) {
      return await handleErrorResponse(response, "Error al obtener especialidades");
    }
    return response.json();
  } catch (err) {
    console.error("Error en obtenerEspecialidadesAPI:", err);
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
    if (!response.ok) {
      return await handleErrorResponse(response, "Error al crear especialidad");
    }
    return response.json();
  } catch (err) {
    console.error("Error en crearEspecialidadAPI:", err);
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
    if (!response.ok) {
      return await handleErrorResponse(response, "Error al actualizar especialidad");
    }
    return response.json();
  } catch (err) {
    console.error("Error en actualizarEspecialidadAPI:", err);
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
    if (!response.ok) {
      return await handleErrorResponse(response, "Error al eliminar especialidad");
    }
    // Asumimos que un DELETE exitoso puede no devolver contenido JSON
    return { mensaje: `Especialidad ${id} eliminada correctamente` };
  } catch (err) {
    console.error("Error en eliminarEspecialidadAPI:", err);
    throw err;
  }
};