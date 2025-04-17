// src/stores/authStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),

  actions: {
    async fetchUser() {
      try {
        const response = await axios.get('http://localhost:3000/auth/me', {
          withCredentials: true,
        });
        this.user = response.data.researcher;
      } catch (error) {
        this.user = null;
        throw error; // Important! Throw so router can handle it
      }
    },

    async login(credentials) {
      await axios.post('http://localhost:3000/auth/login', credentials, {
        withCredentials: true,
      });
      await this.fetchUser();
    },

    async register(userData) {
      await axios.post('http://localhost:3000/auth/register', userData, {
        withCredentials: true,
      });
      await this.fetchUser();
    },

    async logout() {
      await axios.post('http://localhost:3000/auth/logout', {}, {
        withCredentials: true,
      });
      this.user = null;
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
  },
});
