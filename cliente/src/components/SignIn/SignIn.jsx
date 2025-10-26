// src/components/SignIn/SignIn.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginAPI } from "../../services/apiServices.js";
import { useAuth } from "../../context/AuthContext";
import "./SignIn.css";

function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth(); // 🔹 Contexto para guardar usuario y token

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const body = await loginAPI({ email, password });

      // 🔹 Guardamos usuario y token en contexto
      login(body.token, body.usuario);

      // 🔹 Redirigir según rol
      switch (body.usuario.rol) {
        case "admin":
          navigate("/admin");
          break;
        case "medico":
          navigate("/medico");
          break;
        case "paciente":
          navigate("/completar-perfil"); // o donde corresponda
          break;
        default:
          navigate("/"); // fallback
      }

    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error en login");
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
