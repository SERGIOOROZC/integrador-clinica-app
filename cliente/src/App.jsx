import React, { useState } from "react"; // 👈 agregamos useState para manejar usuario global
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // 👈 Navigate para redirigir rutas protegidas
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Doctors from "./components/Doctors/Doctors";
import About from "./components/About/About";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import NotFound from "./pages/404/404";
// 1.  Importamos la página principal de reservas que contiene el formulario
import AgendarTurno from "./pages/ReservarTurnos/AgendarTurno.jsx"; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




function App() {
  // 👇 Estado global del usuario logueado
  // guardar la información del usuario logueado en un estado que toda la app pueda usar, no solo en un componente
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      {/* Navbar siempre arriba */}
      <Navbar />
   
      <ToastContainer />

        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/about" element={<About />} />

        {/* Login: le pasamos setUser para actualizar el estado global al loguearse */}
        <Route path="/signin" element={<SignIn setUser={setUser} />} />

        {/* Registro: le pasamos user para mostrar campos adicionales si es admin */}
        <Route path="/signup" element={<SignUp user={user} />} />
       
        {/* Ruta protegida: solo pacientes logueados pueden reservar */}
        <Route 
          path="/reservar" 
          element={user?.rol === "paciente" ? <AgendarTurno /> : <Navigate to="/signin" />}
        />

        {/* Ruta 404 para cualquier ruta no definida */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
