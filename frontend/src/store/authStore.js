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

    async checkAuth() {
      try {
        const { data } = await api.get('/auth/me');
        this.user = data.researcher;
        return true;
      } catch (error) {
        console.error('Auth check failed:', error);
        this.user = null;
        return false;
      }
    },

    async logout() {
      try {
        await api.post('/auth/logout');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.$reset();
      }
    },

    clearUser() {
      this.user = null;
    },

    setUser(user) {
      this.user = user;
    },

  },

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  persist: true,
});
