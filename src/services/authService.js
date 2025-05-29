// client/src/services/authService.js
import axios from 'axios';

// --- MODIFICATION ICI ---
// Utilise REACT_APP_API_BASE_URL s'il est défini (sur Vercel),
// sinon utilise l'URL de Render pour la production (fallback),
// sinon utilise l'URL locale pour le développement.
// Assurez-vous que votre backend local tourne sur le port 9000.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gestion-factures-backend-1.onrender.com';
// ------------------------

// --- Ajout d'une constante pour le préfixe des routes d'authentification ---
const AUTH_API_PREFIX = '/api/auth';
// -------------------------------------------------------------------------

const register = async (name, email, password) => {
  // --- MODIFICATION ICI : Utilise API_BASE_URL et AUTH_API_PREFIX ---
  const response = await axios.post(`${API_BASE_URL}${AUTH_API_PREFIX}/register`, { name, email, password });
  // -------------------------------------------------------------------
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (email, password) => {
  // --- MODIFICATION ICI : Utilise API_BASE_URL et AUTH_API_PREFIX ---
  const response = await axios.post(`${API_BASE_URL}${AUTH_API_PREFIX}/login`, { email, password });
  // -------------------------------------------------------------------
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService;