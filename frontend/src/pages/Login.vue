<template>
  <div class="dot-plane">
    <div class="dot-grid"></div>
  </div>
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?
        <router-link class="primary" to="/register">Register</router-link>
      </p>
    </div>
</template>

<script>
import { useAuthStore } from "../store/authStore";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      const authStore = useAuthStore();
      try {
        await authStore.login({ email: this.email, password: this.password });
        this.$router.push("/dashboard");
      } catch (error) {
        alert("Login failed");
      }
    },
  },
};
</script>

<style scoped>
.dot-plane {
  inset: 0;
  background: #161f27;
  overflow: hidden;
  z-index: -1;
  perspective: 800px;
  width: 100vw;
  height: 100vh;
}

.dot-grid {
  pointer-events: none;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 550vw;
  height: 550vh;
  z-index: -1;
  transform: translate(-50%, -50%) rotateX(65deg);
  background-image: radial-gradient(#ffffff 1px, transparent 1px);
  background-size: 30px 30px;
  animation: scrollGrid 30s linear infinite;
  opacity: 0.2;
  will-change: transform;
}

@keyframes scrollGrid {
  from {
    transform: translate(-50%, -50%) rotateX(50deg) rotateZ(40deg) translate(0);
  }
  to {
    transform: translate(-50%, -50%) rotateX(50deg) rotateZ(40deg) translate(-400px);
  }
}

h2 {
  text-align: center;
  margin: 0 0 1rem 0;
}

.login-container {
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  max-width: 400px;
  width: 100%;
  background-color: var(--background-alt);
  padding: 20px;
  border-radius: var(--border-radius);
  z-index: 999;
}

input,
button {
  width: 100%;
}
</style>
