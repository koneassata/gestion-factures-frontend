// client/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService'; // <-- Importez l'export par défaut

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Vous pouvez ajouter une vérification de token expiré ici
        // Pour l'instant, on assume que si un user est là, il est authentifié
        setUser(userData);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem('user'); // Nettoyer si le JSON est corrompu
        setIsAuthenticated(false);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Utilisez authService.login
      const data = await authService.login(email, password);
      setUser(data);
      setIsAuthenticated(true);
      setLoading(false);
      return data; // Retourner les données pour une éventuelle utilisation après login
    } catch (error) {
      setLoading(false);
      console.error('Login failed in AuthContext:', error);
      // Pour s'assurer que l'erreur est bien propagée au composant qui appelle login
      throw error.response?.data?.message || error.message || 'Login failed';
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      // Utilisez authService.register
      const data = await authService.register(name, email, password);
      setUser(data);
      setIsAuthenticated(true);
      setLoading(false);
      return data; // Retourner les données pour une éventuelle utilisation après register
    } catch (error) {
      setLoading(false);
      console.error('Register failed in AuthContext:', error);
      // Pour s'assurer que l'erreur est bien propagée au composant qui appelle register
      throw error.response?.data?.message || error.message || 'Registration failed';
    }
  };

  const logout = () => {
    authService.logout(); // Appeler la fonction logout du service
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};