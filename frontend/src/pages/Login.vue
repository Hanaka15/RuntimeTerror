<template>
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <router-link class="primary" to="/register">Register</router-link></p>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from '../store/authStore';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      async login() {
        const authStore = useAuthStore();
        try {
          await authStore.login({ email: this.email, password: this.password });
          this.$router.push('/dashboard');
        } catch (error) {
          alert('Login failed');
        }
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
    @import '../style/style.scss';
  </style>
