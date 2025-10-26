// src/components/SignUp/SignUp.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registrarUsuarioAPI } from "../../services/apiServices.js";
import { useAuth } from "../../context/AuthContext";
import "./SignUp.css";


function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth(); // 🔹 Contexto para guardar usuario y token

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    rol: "paciente", // por defecto
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const body = await registrarUsuarioAPI(formData);

      // 🔹 Guardamos usuario y token en contexto
      login(body.token, body.usuario);

      toast.success("Registro exitoso");

      // 🔹 Redirigir según rol
      switch (body.usuario.rol) {
        case "admin":
          navigate("/admin");
          break;
        case "medico":
          navigate("/medico");
          break;
        case "paciente":
          navigate("/completar-perfil"); // o ruta que corresponda
          break;
        default:
          navigate("/");
      }

    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error en registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select name="rol" value={formData.rol} onChange={handleChange}>
          <option value="paciente">Paciente</option>
          <option value="medico">Médico</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
}

export default SignUp;
