// src/components/SignIn/SignIn.jsx (CORREGIDO)

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// Asumimos que loginAPI maneja el POST del login y devuelve { token, usuario }
import { loginAPI } from "../../services/apiServices.js"; 
import { useAuth } from "../../context/AuthContext";
import "./SignIn.css";

function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ******************************************************
  // FUNCIÓN CORREGIDA
  // ******************************************************
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Paso 1: Intentar el inicio de sesión.
      const body = await loginAPI({ email, password });
      // Si loginAPI fue exitoso, guardamos el token y los datos de usuario.
      login(body.token, body.usuario);

      // Paso 2: Navegar según el rol.
      switch (body.usuario.rol) {
        case "admin":
          navigate("/admin");
          break;
        case "medico":
          navigate("/medico");
          break;
        case "paciente":
          // 🔹 Lógica para verificar perfil del paciente.
          
          // ¡ATENCIÓN! Usaremos la ruta que nos dio el error (aunque no exista aún en tu router)
          // y le agregamos el manejo de errores robusto.
          const res = await fetch("http://localhost:3000/paciente/verificar-perfil", {
            headers: { Authorization: `Bearer ${body.token}` }
          });

          // ******************************************************
          // CORRECCIÓN CLAVE para el SyntaxError:
          // Validamos si la respuesta NO fue exitosa (res.ok es false si es 404, 500, etc.)
          // ******************************************************
          if (!res.ok) {
            // Si hay un error, el servidor podría devolver TEXTO, no JSON.
            // Para no romper la aplicación, leemos la respuesta como TEXTO.
            const errorBodyText = await res.text();
            
            // Si la ruta /verificar-perfil sigue sin existir (404), esto evitará el error
            // de JSON y nos permitirá registrar el fallo de manera limpia.
            console.error(`Error ${res.status} en la verificación de perfil.`, errorBodyText);
            
            // Si no se pudo verificar, asumimos que debe completar el perfil.
            // NOTA: Esta es una ASUNCIÓN. Lo ideal es que el BackEnd devuelva un 200 con { perfilCompleto: false }.
            navigate("/completar-perfil"); 
            break;
          }

          // Si llegamos aquí, la respuesta fue 200 (OK), ¡es seguro leer el JSON!
          const data = await res.json();

          if (!data.perfilCompleto) {
            navigate("/completar-perfil");
          } else {
            navigate("/paciente"); // paciente con perfil completo
          }
          break;
        default:
          navigate("/");
      }

    } catch (error) {
      // Este 'catch' atrapará errores de red, o el error que lanzamos arriba,
      // o cualquier error que venga de 'loginAPI'
      console.error(error);
      toast.error(error.message || "Error en el inicio de sesión. Por favor, revisa tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
}

export default SignIn;