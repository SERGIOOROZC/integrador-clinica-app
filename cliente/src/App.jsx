import React, { useState } from "react"; 
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";

// 🔑 Importamos MedicoPanel
import MedicoPanel from "./pages/Medico/MedicoPanel.jsx"; 
// ✅ CORRECCIÓN FINAL: Ruta ajustada según la estructura de carpeta "components"
import ListadoMedicos from "./components/ListadoMedicos/ListadoMedicos.jsx"; 

import About from "./components/About/About";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import NotFound from "./pages/404/404";

// Componente para el formulario final de reserva (el que necesita el ID)
import AgendarTurnosPage from "./pages/AgendarTurnos/AgendarTurnos.jsx"; 

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
    // 👇 Estado global del usuario logueado
    const [user, setUser] = useState(null);

    return (
        <BrowserRouter>
            {/* Navbar siempre arriba */}
            <Navbar />
        
            <ToastContainer />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />

                {/* Login: le pasamos setUser para actualizar el estado global al loguearse */}
                <Route path="/signin" element={<SignIn setUser={setUser} />} />

                {/* Registro: le pasamos user para mostrar campos adicionales si es admin */}
                <Route path="/signup" element={<SignUp user={user} />} />
                
                {/* 🔑 RUTA PROTEGIDA PARA EL PANEL MÉDICO/ADMIN */}
                <Route 
                    path="/medico" 
                    element={(user?.rol === "medico" || user?.rol === "admin") ? <MedicoPanel /> : <Navigate to="/signin" />}
                />
                
                {/* 🔑 RUTA 1: /reservar - Página que MUESTRA EL LISTADO DE MÉDICOS (Paciente) */}
                <Route 
                    path="/reservar" 
                    element={user?.rol === "paciente" ? <ListadoMedicos /> : <Navigate to="/signin" />}
                />
                
                {/* 🔑 RUTA 2: /agendar/:idMedico - Página que MUESTRA EL FORMULARIO (Paciente) */}
                <Route 
                    path="/agendar/:idMedico" 
                    element={user?.rol === "paciente" ? <AgendarTurnosPage /> : <Navigate to="/signin" />}
                />

                {/* Ruta 404 para cualquier ruta no definida */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;