// src/stores/authStore.js
import { defineStore } from 'pinia';
import api from '@/api/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),

  actions: {
    async fetchUser() {
      try {
        const response = await api.get('/auth/me');
        this.user = response.data.researcher;
      } catch (error) {
        this.user = null;
        throw error;
      }
    },

    async login(credentials) {
      await api.post('/auth/login', credentials);
      await this.fetchUser();
    },

    async register(userData) {
      await api.post('/auth/register', userData);
      await this.fetchUser();
    },

    async logout() {
      await api.post('/auth/logout');
      this.user = null;
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
  },
});
