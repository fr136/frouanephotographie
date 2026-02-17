import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Collections API
export const collectionsAPI = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API}/collections`);
      return response.data;
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  },

  getBySlug: async (slug) => {
    try {
      const response = await axios.get(`${API}/collections/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching collection ${slug}:`, error);
      throw error;
    }
  },

  create: async (collectionData) => {
    try {
      const response = await axios.post(`${API}/collections`, collectionData);
      return response.data;
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  },

  update: async (collectionId, updateData) => {
    try {
      const response = await axios.put(`${API}/collections/${collectionId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating collection:', error);
      throw error;
    }
  },

  delete: async (collectionId) => {
    try {
      const response = await axios.delete(`${API}/collections/${collectionId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting collection:', error);
      throw error;
    }
  }
};

// Photos API
export const photosAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await axios.get(`${API}/photos`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching photos:', error);
      throw error;
    }
  },

  getById: async (photoId) => {
    try {
      const response = await axios.get(`${API}/photos/${photoId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching photo ${photoId}:`, error);
      throw error;
    }
  },

  create: async (photoData) => {
    try {
      const response = await axios.post(`${API}/photos`, photoData);
      return response.data;
    } catch (error) {
      console.error('Error creating photo:', error);
      throw error;
    }
  },

  update: async (photoId, updateData) => {
    try {
      const response = await axios.put(`${API}/photos/${photoId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating photo:', error);
      throw error;
    }
  },

  delete: async (photoId) => {
    try {
      const response = await axios.delete(`${API}/photos/${photoId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await axios.get(`${API}/health`);
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};
