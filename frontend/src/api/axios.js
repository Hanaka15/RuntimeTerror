// src/api/axios.js
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import router from '@/router';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

// Response interceptor to catch 401s
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();

      if (authStore.user) {
        await authStore.logout();
      }

      // Redirect to login if not already there
      if (router.currentRoute.value.name !== 'Login') {
        router.push({ name: 'Login' });
      }
    }

    return Promise.reject(error); // still reject to allow local try/catch
  }
);

export default api;
