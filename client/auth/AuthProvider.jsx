import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  // Inicializar desde localStorage si existe
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("authToken") || null;
    } catch (error) {
      console.error("Error al leer token de localStorage:", error);
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("authUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error al leer usuario de localStorage:", error);
      return null;
    }
  });

  const isAuthenticated = Boolean(token);

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.id,
        username: payload.username,
        email: payload.email,
        roles: payload.rol, // El backend guarda como 'rol' pero lo nombramos 'roles' en frontend
      };
    } catch (error) {
      console.error("Token inválido:", error);
      return null;
    }
  };

  // Guardar en localStorage cuando cambie el token o el usuario
  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [user]);

  const login = (tokenData) => {
    setToken(tokenData);
    const userData = decodeToken(tokenData);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  const getAuthHeaders = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value = {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    getAuthHeaders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
