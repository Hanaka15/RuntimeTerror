<template>
  <div class="dot-plane">
    <div class="dot-grid"></div>
  </div>
  <div class="login-container">
    <h2>Register</h2>
    <form @submit.prevent="register" data-test="register-form">
      <input v-model="email" type="email" placeholder="Email" required data-test="register-email" />
      <input v-model="username" type="text" placeholder="Username" required data-test="register-username"/>
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
        data-test="register-password"
      />
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        required
        data-test="register-confirm-password"
      />

      <!-- Show unmet password rules -->
      <ul v-if="unmetPasswordRules.length" class="password-rules">
        <li v-for="(rule, index) in unmetPasswordRules" :key="index">
          {{ rule.label }}
        </li>
      </ul>

      <button :disabled="!isPasswordValid" type="submit" data-test="register-button">Register</button>
    </form>
    <p>
      Already have an account?
      <router-link class="primary" to="/login">Login</router-link>
    </p>
  </div>
</template>

<script>
import { useAuthStore } from "../store/authStore";

export default {
  data() {
    return {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    };
  },
  computed: {
    passwordLengthValid() {
      return this.password.length >= 8;
    },
    hasUppercase() {
      return /[A-Z]/.test(this.password);
    },
    hasNumber() {
      return /\d/.test(this.password);
    },
    hasSymbol() {
      return /[!@#$%^&*(),.?":{}|<>]/.test(this.password);
    },
    passwordsMatch() {
      return (
        this.password &&
        this.confirmPassword &&
        this.password === this.confirmPassword
      );
    },
    isPasswordValid() {
      return (
        this.passwordLengthValid &&
        this.hasUppercase &&
        this.hasNumber &&
        this.hasSymbol &&
        this.passwordsMatch
      );
    },
    unmetPasswordRules() {
      const rules = [];

      if (!this.passwordLengthValid) {
        rules.push({ label: "🔒 Must be at least 8 characters long" });
      }
      if (!this.hasUppercase) {
        rules.push({ label: "🔠 Must include an uppercase letter (A-Z)" });
      }
      if (!this.hasNumber) {
        rules.push({ label: "🔢 Must include a number (0-9)" });
      }
      if (!this.hasSymbol) {
        rules.push({ label: "🔣 Must include a special character (!@#...)" });
      }
      if (!this.passwordsMatch) {
        rules.push({ label: "⚠️ Passwords must match" });
      }

      return rules;
    },
  },
  methods: {
    async register() {
      const authStore = useAuthStore();

      if (!this.isPasswordValid) {
        alert("Please meet all password requirements");
        return;
      }

      try {
        await authStore.register({
          email: this.email,
          username: this.username,
          password: this.password,
        });
        this.$router.push("/login");
      } catch (error) {
        alert("Registration failed");
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
  width: 400vw;
  height: 400vh;
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
    transform: translate(-50%, -50%) rotateX(50deg) rotateZ(40deg)
      translate(-300px);
  }
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
  margin-bottom: 0.75rem;
}

button {
  cursor: pointer;
}

.password-rules {
  text-align: left;
  list-style: none;
  padding: 0;
  font-size: 0.9em;
  margin-bottom: 1em;

  li {
    color: #c84a4a;
    margin: 0.3em 0;
  }
}
</style>
