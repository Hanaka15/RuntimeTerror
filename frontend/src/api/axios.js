import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import router from '@/router';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

let isRedirecting = false; // Prevent redirection loops

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();

      // Clear user state if logged in
      if (authStore.user) {
        await authStore.logout();
      }

      // Prevent multiple redirects to the login page
      if (!isRedirecting && router.currentRoute.value.name !== 'Login') {
        isRedirecting = true;
        router.push({ name: 'Login' }).finally(() => {
          isRedirecting = false;
        });
      }
    }

    return Promise.reject(error); // Reject the error for local handling
  }
);

export default api;