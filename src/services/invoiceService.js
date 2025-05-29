// client/src/services/invoiceService.js
import axios from 'axios';
import authService from './authService';

// --- MODIFICATION ICI : Rendre l'URL de base dynamique ---
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://gestion-factures-backend-1.onrender.com';
// --------------------------------------------------------

// --- NOUVEAU : Définir le préfixe API pour les factures ---
const API_INVOICES_PREFIX = '/api/invoices';
// -------------------------------------------------------

// Fonction utilitaire pour obtenir les en-têtes d'autorisation
const getAuthHeaders = () => {
  const user = authService.getCurrentUser();
  if (user && user.token) {
    return {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  } else {
    return {};
  }
};

// Récupérer toutes les factures
const getInvoices = async () => {
  // --- MODIFICATION ICI : Utiliser API_BASE_URL et API_INVOICES_PREFIX ---
  const response = await axios.get(`${API_BASE_URL}${API_INVOICES_PREFIX}`, getAuthHeaders());
  return response.data;
};

// Récupérer une seule facture par ID
const getInvoiceById = async (id) => {
  // --- MODIFICATION ICI ---
  const response = await axios.get(`${API_BASE_URL}${API_INVOICES_PREFIX}/${id}`, getAuthHeaders());
  return response.data;
};

// Créer une nouvelle facture
const createInvoice = async (invoiceData) => {
  // --- MODIFICATION ICI : Utiliser API_BASE_URL et API_INVOICES_PREFIX ---
  const response = await axios.post(`${API_BASE_URL}${API_INVOICES_PREFIX}`, invoiceData, getAuthHeaders());
  return response.data;
};

// Mettre à jour une facture
const updateInvoice = async (id, invoiceData) => {
  // --- MODIFICATION ICI ---
  const response = await axios.put(`${API_BASE_URL}${API_INVOICES_PREFIX}/${id}`, invoiceData, getAuthHeaders());
  return response.data;
};

// Supprimer une facture
const deleteInvoice = async (id) => {
  // --- MODIFICATION ICI ---
  const response = await axios.delete(`${API_BASE_URL}${API_INVOICES_PREFIX}/${id}`, getAuthHeaders());
  return response.data;
};

// Exportez un seul objet par défaut contenant toutes les fonctions de ce service
const invoiceService = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};

export default invoiceService;