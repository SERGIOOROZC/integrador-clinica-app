// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Estado principal: token y usuario
  const [authState, setAuthState] = useState({ token: null, usuario: null });
  const [loading, setLoading] = useState(true);

  // Cargar token y usuario desde localStorage al montar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('usuario');
    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({ token, usuario: user });
      } catch (e) {
        console.error('Error al leer usuario de localStorage:', e);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  // Función de login o actualización de usuario
  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(user));
    setAuthState({ token, usuario: user });
    toast.success(`¡Bienvenido, ${user.nombre}!`, { autoClose: 2000 });
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setAuthState({ token: null, usuario: null });
    toast.info('Sesión cerrada.', { autoClose: 2000 });
    navigate('/login');
  };

  // 🔹 Función para actualizar perfil del paciente
  const actualizarPerfilPaciente = (datosActualizados) => {
    if (!authState.usuario) return;
    const usuarioActualizado = {
      ...authState.usuario,
      ...datosActualizados,
      perfil_paciente_completo: true, // aseguramos que quede completo
    };
    login(authState.token, usuarioActualizado); // actualiza contexto y localStorage
    navigate('/reservar'); // redirige automáticamente a agendar turno
  };

  // Valor que se comparte en toda la app
  const contextValue = {
    user: authState.usuario,
    token: authState.token,
    loading,
    login,
    logout,
    actualizarPerfilPaciente,
    isAuthenticated: !!authState.token,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px', fontSize: '1.2em' }}>
          Inicializando sesión...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
