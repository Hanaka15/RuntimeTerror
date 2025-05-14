import { defineStore } from 'pinia';
import api from '@/api/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),

  actions: {
    async login(credentials) {
      try {
        const { data } = await api.post('/auth/login', credentials);
        this.user = data.researcher;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },

    async register(userData) {
      try {
        const { data } = await api.post('/auth/register', userData);
        this.user = data.researcher;
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    },

    async logout() {
      try {
        await api.post('/auth/logout');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.user = null;
      }
    },

    clearUser() {
      this.user = null;
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  persist: true,
});
