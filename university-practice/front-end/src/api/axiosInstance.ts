// src/api/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

// 🔑 Змінна для збереження токена в памʼяті
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
