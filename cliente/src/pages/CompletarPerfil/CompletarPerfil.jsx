import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'; 
import "./CompletarPerfil.css"; 

const API_BASE_URL = "http://localhost:3000";

const CompletarPerfil = () => {
    // Asumiendo que useAuth() también proporciona el estado de carga, 
    // pero si no, verificamos el user
    const { user, logout } = useAuth(); 
    const navigate = useNavigate();

    const [datosPerfil, setDatosPerfil] = useState({
        dni: "",
        telefono: "",
        edad: "",
    });
    const [loading, setLoading] = useState(false);

    // -----------------------------------------------------------
    // 1. Manejo de Redirección y Sesión
    // -----------------------------------------------------------
    useEffect(() => {
        // 🔑 CAMBIO CRÍTICO: Si el usuario NO existe, lo mandamos a login.
        // Esto captura la lógica de tu error "Token de usuario no encontrado".
        if (!user) {
            // No usamos toast.error aquí para evitar duplicar el mensaje 
            // que ya da el AuthContext si es el que navega.
            navigate('/login'); 
            return;
        }

        // Si ya hay datos, redirigimos (Si decides usar esta lógica)
        /*
        if (user.dni && user.telefono && user.edad) {
             toast.info("Tu perfil ya está completo. Continuamos.");
             navigate('/reservar');
        }
        */
    }, [user, navigate]);


    // -----------------------------------------------------------
    // 2. Manejo de cambios en el formulario
    // -----------------------------------------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatosPerfil({ ...datosPerfil, [name]: value });
    };

    // -----------------------------------------------------------
    // 3. Manejo del envío del formulario
    // -----------------------------------------------------------
    const handleCompletarPerfil = async (e) => {
        e.preventDefault();
        
        // 🛑 PRE-VERIFICACIÓN DE SESIÓN (para evitar errores en la lógica)
        const idUsuario = user?.id_usuario; 

        if (!idUsuario) {
            toast.error("Error de sesión: ID de usuario no encontrado. Intentando reconectar...");
            setLoading(false);
            return;
        }
        
        setLoading(true);

        // Verificación de campos requeridos (CORREGIDA)
        if (datosPerfil.dni.trim() === "" || 
            datosPerfil.telefono.trim() === "" || 
            datosPerfil.edad === "" 
        ) {
            toast.error("Por favor, completa todos los campos requeridos.");
            setLoading(false);
            return;
        }
        
        // Objeto a enviar al Back-end
        const datosAEnviar = {
            id_usuario: idUsuario, 
            dni: datosPerfil.dni,
            telefono: datosPerfil.telefono,
            edad: datosPerfil.edad,
            nombre: user?.nombre || '', 
            apellido: user?.apellido || '', 
        };
        
        try {
            // Petición al endpoint POST /paciente
            // 🔑 CAMBIO: Asegúrate de enviar el token JWT si la ruta /paciente lo requiere
            // (Tu código Front-end no está enviando el token en esta petición fetch)
            const token = localStorage.getItem('token'); 

            const res = await fetch(`${API_BASE_URL}/paciente`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // ⬅️ ¡Añadido el Token!
                },
                body: JSON.stringify(datosAEnviar),
            });

            const responseData = await res.json();

            if (!res.ok) {
                console.error("Error al guardar perfil (Backend Response):", responseData);
                toast.error(`Error: ${responseData.error || 'No se pudo guardar el perfil.'}`);
                return;
            }

            // 🟢 ÉXITO: Redirección
            toast.success(responseData.mensaje || "✅ Perfil completado con éxito. ¡A reservar!");
            navigate('/reservar'); 

        } catch (error) {
            console.error("Error de red/servidor al enviar el formulario:", error);
            toast.error("Hubo un error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------------------------------------
    // 4. Renderizado (JSX)
    // -----------------------------------------------------------
    // 🔑 Renderizado condicional: Muestra un loader si user es null
    if (!user) {
        return (
            <div className="completar-perfil-container">
                <h2>Cargando sesión...</h2>
                <p>Si esto tarda, por favor, ve a <a href="/login" onClick={logout}>Login</a>.</p>
            </div>
        );
    }

    return (
        <div className="completar-perfil-container">
            <h2>Completar Perfil de Paciente</h2>
            <p>Datos de la cuenta: {user.nombre} {user.apellido}</p>
            <form onSubmit={handleCompletarPerfil}>
                
                {/* DNI */}
                <label htmlFor="dni">DNI</label>
                <input
                    type="text"
                    name="dni"
                    id="dni"
                    value={datosPerfil.dni}
                    onChange={handleChange}
                    placeholder="Número de identificación"
                    required
                />
                
                {/* Teléfono */}
                <label htmlFor="telefono">Teléfono</label>
                <input
                    type="tel"
                    name="telefono"
                    id="telefono"
                    value={datosPerfil.telefono}
                    onChange={handleChange}
                    placeholder="Ej: 3415550000"
                    required
                />
                
                {/* Edad */}
                <label htmlFor="edad">Edad</label>
                <input
                    type="number"
                    name="edad"
                    id="edad"
                    value={datosPerfil.edad}
                    onChange={handleChange}
                    placeholder="Tu edad en años"
                    required
                    min="1" 
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Completar y Continuar"}
                </button>
            </form>
        </div>
    );
};

export default CompletarPerfil;