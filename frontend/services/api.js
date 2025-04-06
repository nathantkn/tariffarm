// services/api.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = {
  getPublicResource: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/public`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getPrivateResource: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/private`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getUserProfile: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;