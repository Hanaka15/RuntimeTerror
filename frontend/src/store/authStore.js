// src/stores/authStore.js
import { defineStore } from 'pinia';
import api from '@/api/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),

  actions: {
    async fetchUser() {
      if (this.user) {
        console.log("User already fetched, skipping /auth/me request.");
        return; // Avoid unnecessary API calls if user is already set
      }
      try {
        const response = await api.get('/auth/me');
        this.user = response.data.researcher;
      } catch (error) {
        console.error("Error fetching user:", error);
        this.user = null;
        if (error.response?.status !== 401) {
          throw error; // Only throw if it's not a 401
        }
      }
    },

    async login(credentials) {
      try {
        await api.post('/auth/login', credentials); // Login request
        await this.fetchUser(); // Fetch user after successful login
      } catch (error) {
        console.error("Login error:", error);
        throw error; // Let the caller handle the error
      }
    },

     async register(userData) {
      try {
        await api.post('/auth/register', userData); // Register request
        //await this.fetchUser(); // Fetch user after successful registration
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
    },
    

    async logout() {
      try {
        await api.post('/auth/logout'); // Logout request
        this.user = null; // Clear user state
      } catch (error) {
        console.error("Logout error:", error);
        throw error;
      }
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user, // Returns true if user is set
  },
});
