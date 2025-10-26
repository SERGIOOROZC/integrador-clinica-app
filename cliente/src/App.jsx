// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Importación de Componentes
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import MedicoPanel from "./pages/Medico/MedicoPanel.jsx";
import ListadoMedicos from "./components/ListadoMedicos/ListadoMedicos.jsx";
import About from "./components/About/About";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import NotFound from "./pages/404/404";
import AgendarTurnosPage from "./pages/AgendarTurnos/AgendarTurnos.jsx";
import CompletarPerfil from "./pages/CompletarPerfil/CompletarPerfil.jsx";
import AdminPanel from "./components/AdminPanel/AdminPanel.jsx";

// Importación de Toast (notificaciones)
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { user, loading } = useAuth();

  // Muestra un indicador de carga mientras el estado de autenticación se verifica
  if (loading) return <div>Verificando estado de sesión...</div>;

  // -------------------------------
  // 🚩 LÓGICA DE RUTAS SIMPLIFICADA
  // -------------------------------
  // Si el usuario no existe, redirige a SignIn.
  // Si existe, verifica el rol para la ruta específica.

  return (
    <>
      <Navbar />
      <ToastContainer />

      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp user={user} />} />

        {/* 🔑 RUTA CRÍTICA: COMPLETAR PERFIL */}
        <Route
          path="/completar-perfil"
          element={
            // Si el usuario no está logueado O no es paciente, lo manda al login.
            !user || user.rol !== "paciente" ? (
              <Navigate to="/signin" replace />
            ) : (
              // Si está logueado y es paciente, renderiza el componente.
              <CompletarPerfil />
            )
          }
        />

        {/* RUTAS DE PACIENTE (verifica que sea paciente y esté logueado) */}
        <Route
          path="/reservar"
          element={
            !user || user.rol !== "paciente" ? (
              <Navigate to="/signin" replace />
            ) : (
              <ListadoMedicos />
            )
          }
        />

        <Route
          path="/agendar/:idMedico"
          element={
            !user || user.rol !== "paciente" ? (
              <Navigate to="/signin" replace />
            ) : (
              <AgendarTurnosPage />
            )
          }
        />

        {/* RUTAS DE MÉDICO */}
        <Route
          path="/medico"
          element={
            !user || (user.rol !== "medico" && user.rol !== "admin") ? (
              <Navigate to="/signin" replace />
            ) : (
              <MedicoPanel />
            )
          }
        />

        {/* 🔹 RUTA DE ADMIN */}
        <Route
          path="/admin"
          element={
            !user || user.rol !== "admin" ? (
              <Navigate to="/signin" replace />
            ) : (
              <AdminPanel />
            )
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
