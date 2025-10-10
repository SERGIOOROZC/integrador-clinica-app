// src/services/apiServices.js

// 🔑 Configuración: URL base de tu backend
// Importante: No lleva '/api' para que coincida con la configuración de tu app.js
const BASE_URL = 'http://localhost:3000'; 

// =========================================================
// 1. AUTENTICACIÓN (LOGIN)
// =========================================================

/**
 * Función para INICIAR SESIÓN
 * @param {object} credenciales - { email, password }
 */
export const loginAPI = async (credenciales) => {
    // La URL es http://localhost:3000/usuario/login
    const url = `${BASE_URL}/usuario/login`; 

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credenciales),
        });

        const body = await response.json();

        if (response.ok) {
            // Devuelve el objeto con token, usuario, etc.
            return body; 
        } else {
            // Manejo de errores 400/500 del backend
            throw new Error(body.error || body.mensaje || "Credenciales incorrectas o error desconocido.");
        }
    } catch (error) {
        console.error("Error en loginAPI:", error);
        throw error;
    }
};


// =========================================================
// 2. MÉDICOS (Listado para Reserva)
// =========================================================

/**
 * Función para OBTENER la lista completa de médicos.
 * @returns {Promise<Array>} Un array de objetos médico.
 */
export const obtenerMedicosAPI = async () => {
    
    const token = sessionStorage.getItem('token'); 
    
    if (!token) {
        throw new Error("No estás autenticado para ver la lista de médicos.");
    }

    try {
        // RUTA: http://localhost:3000/medico
        const url = `${BASE_URL}/medico`; 
        
        const parametros = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
        };

        const response = await fetch(url, parametros);
        const body = await response.json();

        if (response.ok) {
            // Retornamos body.medicos que es el array devuelto por el backend
            return body.medicos || []; 
        } else {
            throw new Error(body.error || "No se pudo cargar la lista de médicos."); 
        }
    } catch (error) {
        console.error("Error al obtener médicos:", error);
        throw error;
    }
};


// =========================================================
// 3. TURNOS (Creación y Consulta)
// =========================================================

/**
 * Función para CREAR un turno
 * @param {object} datosTurno - Incluye id_medico, id_paciente, fecha, hora, etc.
 */
export const crearTurnoAPI = async (datosTurno) => {
    
    const token = sessionStorage.getItem('token'); 
    
    if (!token) {
        throw new Error("No estás autenticado para crear un turno.");
    }

    try {
        // RUTA: http://localhost:3000/turnos
        const url = `${BASE_URL}/turno`; // Usamos '/turno' ya que app.js usa ese prefijo
        
        const parametros = {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(datosTurno) 
        };

        const response = await fetch(url, parametros);
        const body = await response.json();

        if (response.ok) {
            return body; 
        } else {
            throw new Error(body.error || "No se pudo crear el turno."); 
        }
    } catch (error) {
        console.error("Error al crear turno:", error);
        throw error;
    }
};

/**
 * Función para obtener la lista de turnos
 * @param {object} filtros - Opcional. Usado para filtrar.
 */
export const obtenerTurnosAPI = async (filtros = {}) => {
    
    const token = sessionStorage.getItem('token'); 
    
    if (!token) {
        throw new Error("No estás autenticado.");
    }

    // Construir los parámetros de consulta (Query Params)
    let queryParams = new URLSearchParams(filtros).toString();
    
    try {
        // RUTA: http://localhost:3000/turnos
        const url = `${BASE_URL}/turno?${queryParams}`; 
        
        const parametros = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
        };

        const response = await fetch(url, parametros);
        const body = await response.json();

        if (response.ok) {
            return body; 
        } else {
            throw new Error(body.error || "No se pudo cargar la lista de turnos."); 
        }
    } catch (error) {
        console.error("Error al obtener turnos:", error);
        throw error;
    }
};