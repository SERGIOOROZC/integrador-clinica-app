

//manejar la autenticación (JWT) y el estado del usuario logueado.

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// 1. Creación del Contexto
const AuthContext = createContext(null);

// Función auxiliar para obtener datos del localStorage
const getInitialUserState = () => {
    // Busca el token y los datos del usuario al cargar la app
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('usuario'));
    
    // Si hay un token y datos, retornamos el estado.
    if (token && user) {
        return { token, usuario: user };
    }
    return { token: null, usuario: null };
};

// 2. Componente Proveedor (Provider)
export const AuthProvider = ({ children }) => {
    // Inicializa el estado revisando el almacenamiento local
    const [authState, setAuthState] = useState(getInitialUserState);
    const [cargando, setCargando] = useState(false);

    // Función de Login (asume que recibe {token, user})
    const login = (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(user));
        setAuthState({ token, usuario: user });
        toast.success(`¡Bienvenido, ${user.nombre}!`, { autoClose: 2000 });
    };

    // Función de Logout
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setAuthState({ token: null, usuario: null });
        toast.info("Sesión cerrada.", { autoClose: 2000 });
    };

    // 3. Valor que se proporciona a toda la aplicación
    const contextValue = {
        ...authState,
        cargando,
        login,
        logout,
        isAuthenticated: !!authState.token, // Booleano simple
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};