import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach JWT token to every request automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('spendwise_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('spendwise_token');
      localStorage.removeItem('spendwise_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
