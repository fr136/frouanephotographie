import axios from 'axios';

const getBackendUrl = () => {
  const configuredUrl = process.env.REACT_APP_BACKEND_URL?.trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  return '';
};

const API = `${getBackendUrl()}/api`;

// Génère ou récupère l'ID de session
const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

export const SESSION_ID = getSessionId();

// Cart API
export const cartAPI = {
  get: async () => {
    const response = await axios.get(`${API}/cart/${SESSION_ID}`);
    return response.data;
  },
  
  addItem: async (photoId, format, quantity = 1) => {
    const response = await axios.post(`${API}/cart/${SESSION_ID}/items`, {
      photoId,
      format,
      quantity
    });
    return response.data;
  },
  
  removeItem: async (itemId) => {
    const response = await axios.delete(`${API}/cart/${SESSION_ID}/items/${itemId}`);
    return response.data;
  },
  
  updateItem: async (itemId, quantity) => {
    const response = await axios.put(`${API}/cart/${SESSION_ID}/items/${itemId}?quantity=${quantity}`);
    return response.data;
  },
  
  applyPromo: async (code) => {
    const response = await axios.post(`${API}/cart/${SESSION_ID}/promo?code=${code}`);
    return response.data;
  },
  
  clear: async () => {
    const response = await axios.delete(`${API}/cart/${SESSION_ID}`);
    return response.data;
  }
};

// Wishlist API
export const wishlistAPI = {
  get: async () => {
    const response = await axios.get(`${API}/wishlist/${SESSION_ID}`);
    return response.data;
  },
  
  addItem: async (photoId) => {
    const response = await axios.post(`${API}/wishlist/${SESSION_ID}/items/${photoId}`);
    return response.data;
  },
  
  removeItem: async (photoId) => {
    const response = await axios.delete(`${API}/wishlist/${SESSION_ID}/items/${photoId}`);
    return response.data;
  }
};

// Newsletter API
export const newsletterAPI = {
  subscribe: async (email) => {
    const response = await axios.post(`${API}/newsletter/subscribe`, { email });
    return response.data;
  }
};

// Export existant
export { collectionsAPI, photosAPI, healthCheck } from './api';
