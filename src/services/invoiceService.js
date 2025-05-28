// client/src/services/invoiceService.js
import axios from 'axios';
import authService from './authService'; // <-- Importation par défaut correcte

const API_URL = 'http://localhost:5000/api/invoices/';

// Fonction utilitaire pour obtenir les en-têtes d'autorisation
const getAuthHeaders = () => {
  const user = authService.getCurrentUser(); // <-- Utilisez la fonction via l'objet authService
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
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

// Récupérer une seule facture par ID
const getInvoiceById = async (id) => {
  const response = await axios.get(API_URL + id, getAuthHeaders());
  return response.data;
};

// Créer une nouvelle facture
const createInvoice = async (invoiceData) => {
  const response = await axios.post(API_URL, invoiceData, getAuthHeaders());
  return response.data;
};

// Mettre à jour une facture
const updateInvoice = async (id, invoiceData) => {
  const response = await axios.put(API_URL + id, invoiceData, getAuthHeaders());
  return response.data;
};

// Supprimer une facture
const deleteInvoice = async (id) => {
  const response = await axios.delete(API_URL + id, getAuthHeaders());
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

export default invoiceService; // <-- Exportation par défaut