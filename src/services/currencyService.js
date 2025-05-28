import axios from 'axios';
import { getToken } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/currencies';

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getAllCurrencies = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};

export const getCurrencyById = async (id) => {
  try {
    const response = await axios.get(`<span class="math-inline">\{API\_URL\}/</span>{id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};

export const createCurrency = async (currencyData) => {
  try {
    const response = await axios.post(API_URL, currencyData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};

export const updateCurrency = async (id, currencyData) => {
  try {
    const response = await axios.put(`<span class="math-inline">\{API\_URL\}/</span>{id}`, currencyData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};

export const deleteCurrency = async (id) => {
  try {
    const response = await axios.delete(`<span class="math-inline">\{API\_URL\}/</span>{id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};