import React, { useState } from "react";
import "./SignUp.css";

function SignUp({ user }) { // 👈 agregamos user como prop para saber si es admin
  // ESTADO *se crea el objeto con los datos que ingresa usuario y se guarda en formData
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  });

  // FUNCION * Maneja los cambios en los inputs.va actualizando los inputs cuando el usuario scribe.
  // setFormData() actualiza el estado ,copia formData y reemplaza solo el campo que cambió.
  const handleChange = (e) => {
    // e.target.name → el nombre del input
    // e.target.value → el valor que escribe el usuario
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // FUNCION * Maneja el envío del formulario , VA HACER UNA PETICION http POST al backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue por defecto /html/.

    // 💡 MODIFICACION CLAVE: Añadir el rol por defecto si no es un registro de médico
    let datosAEnviar = { ...formData }; 

    // Si NO hay campos de médico, asumimos que es un registro de usuario normal
    // y establecemos el rol a "usuario".
    if (!datosAEnviar.nombreMedico) {
      datosAEnviar.rol = "paciente"; 
    }
    // Si un admin está registrando un médico, el backend debe manejar la lógica
    // de asignación de rol "medico" y usar los campos nombreMedico/apellidoMedico.
    
    console.log("Datos enviados:", datosAEnviar); // Ahora se incluye el rol

    try {
      // Llamada al backend usando fetch con post porque enviamos datos el objeto datosAEnviar
      const response = await fetch("http://localhost:3000/usuario", {
        method: "POST", // tipo de petición
        headers: {
          "Content-Type": "application/json", // le decimos al servidor que enviamos JSON
        },
        body: JSON.stringify(datosAEnviar), // convertimos el objeto final a JSON
      });

      // Respuesta del servidor ,convertimos la respuesta a JSON
      const data = await response.json();

      // Si la respuesta fue exitosa
      if (response.ok) {
        alert("✅ Registro exitoso");
        console.log("Respuesta del servidor:", data);
        
        // Opcional: limpiar el formulario después del éxito
        setFormData({
            nombre: "",
            apellido: "",
            email: "",
            password: "",
        });

      } else {
        alert("❌ Error en el registro");
        console.error("Errores:", data);
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
      alert("⚠️ No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="signup-container">
      <h2>Crear Una Cuenta</h2>
      {/* Cuando el usuario aprieta “Registro”, se ejecuta la función handleSubmit.enviamos el formulario */}
      <form onSubmit={handleSubmit} className="signup-form">
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
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password (hasta 10 caracteres)"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
        />

        {/* 👉 BLOQUE CONDICIONAL: estos campos solo aparecen si el usuario logueado es admin */}
        {user?.rol === "admin" && (
          <>
            <h3>Registrar Médico</h3>

            <input
              type="text"
              name="nombreMedico"
              placeholder="Nombre del médico"
              value={formData.nombreMedico || ""}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="apellidoMedico"
              placeholder="Apellido del médico"
              value={formData.apellidoMedico || ""}
              onChange={handleChange}
              required
            />

            {/* Selección de especialidad desde la tabla especialidad */}
            <select
              name="id_especialidad"
              value={formData.id_especialidad || ""}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona especialidad</option>
              <option value="1">Médico clínico</option>
              <option value="2">Pediatra</option>
              <option value="3">Traumatólogo</option>
            </select>
          </>
        )}
        {/* 👆 fin del bloque solo visible para el admin */}

        <button type="submit">Registro</button>
      </form>

      <p className="signin-link">
        Ya tienes una cuenta? <a href="/signin">Login</a>
      </p>
    </div>
  );
}

export default SignUp;