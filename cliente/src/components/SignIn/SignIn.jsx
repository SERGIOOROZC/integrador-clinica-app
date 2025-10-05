import React, { useState } from "react";
import "./SignIn.css";

function SignIn({ setUser }) { // 👈 Recibimos setUser para actualizar el estado global del usuario logueado
  // Estado para guardar email y password
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Actualiza el estado cuando el usuario escribe
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Se ejecuta al presionar el botón "Login"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    console.log("Login:", formData);

    try {
      // Petición POST al backend
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Indicamos que enviamos JSON
        },
        body: JSON.stringify(formData), // Convertimos el estado a JSON
      });

      const data = await response.json(); // Convertimos la respuesta a JSON
      console.log("Datos recibidos del servidor:", data); // 👈 aquí vemos el objeto JSON que envía el backend

      if (response.ok) {
        alert("✅ Login exitoso");

        // 👇 Guardamos el usuario globalmente
        setUser(data.user);

        // 👇 Guardamos token en localStorage para mantener sesión (opcional)
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // 👇 Redirigimos según el rol
        if (data.user.rol === "admin") window.location.href = "/admin";
        else if (data.user.rol === "medico") window.location.href = "/medico";
        else window.location.href = "/reservar"; // paciente

      } else {
        // 👇 Si login incorrecto
        alert("❌ Usuario o contraseña incorrectos");
        console.error("Error de login:", data);
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
      alert("⚠️ No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="signin-container">
      <h2>Bienvenido de nuevo</h2>
      <form onSubmit={handleSubmit} className="signin-form">
        <input
          type="email"
          name="email"
          placeholder="Ingrese su email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Ingrese su password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>
      </form>

      <p className="signup-link">
        No tienes una cuenta? <a href="/signup">Registrate</a>
      </p>
    </div>
  );
}

export default SignIn;
