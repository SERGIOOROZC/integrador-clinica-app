

const BASE_URL = 'http://localhost:3000/api'; 


// 🔑 Función para CREAR un turno 
export const crearTurnoAPI = async (datosTurno) => {
    
    // 1. Obtener el Token: Necesario para la ruta protegida
    const token = sessionStorage.getItem('token'); 
    
    if (!token) {
        throw new Error("No estás autenticado para crear un turno.");
    }

    try {
        // ⚠️ RUTA: Asumimos que la ruta en el Backend es POST /api/turnos
        const url = `${BASE_URL}/turnos`; 
        
        const parametros = {
            method: "POST", // Usamos POST para crear un nuevo recurso
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Enviamos el Token
            },
            // Enviamos los datos del turno en el body
            body: JSON.stringify(datosTurno) 
        };

        const response = await fetch(url, parametros);
        
        const body = await response.json();

        if (response.ok) {
            // Éxito
            return body; 
        } else {
            // Error (ej: validación fallida, médico no disponible)
            throw new Error(body.error || "No se pudo crear el turno."); 
        }
    } catch (error) {
        console.error("Error al crear turno:", error);
        throw error;
    }
};

//  Función para obtener la lista de turnos (la que ya tenías)
export const obtenerTurnosAPI = async (filtros = {}) => {
    
    // 1. 🔑 Obtener el Token: Es necesario para que el Backend sepa quién eres.
    const token = sessionStorage.getItem('token'); 
    
    if (!token) {
        throw new Error("No estás autenticado.");
    }

    // 2. ⚙️ Construir los parámetros de consulta (Query Params)
    let queryParams = new URLSearchParams(filtros).toString();
    
    try {
        // RUTA: Asumimos que la ruta en el Backend es GET /api/turnos
        const url = `${BASE_URL}/turnos?${queryParams}`; 
        
        const parametros = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // ENVIAMOS EL TOKEN
                "Authorization": `Bearer ${token}` 
            },
        };

        const response = await fetch(url, parametros);
        
        const body = await response.json();

        if (response.ok) {
            // Éxito
            return body; 
        } else {
            // Error
            throw new Error(body.error || "No se pudo cargar la lista de turnos."); 
        }
    } catch (error) {
        console.error("Error al obtener turnos:", error);
        throw error;
    }
};

// [ ... Aquí irían tus funciones de logueo y registro (loginAPI, registerAPI) ... ]