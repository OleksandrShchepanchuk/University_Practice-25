// src/api/axiosInstance.ts
import axios from 'axios';
import { auth } from '../firebaseConfig';
import { getIdToken } from 'firebase/auth';
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});


axiosInstance.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await getIdToken(user, true); // optional: force refresh
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
