<template>
  <div class="login-container">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="username" type="text" placeholder="Username" required />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        required
      />

      <!-- Show unmet password rules -->
      <ul v-if="unmetPasswordRules.length" class="password-rules">
        <li v-for="(rule, index) in unmetPasswordRules" :key="index">
          {{ rule.label }}
        </li>
      </ul>

      <button :disabled="!isPasswordValid" type="submit">Register</button>
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
      return this.password && this.confirmPassword && this.password === this.confirmPassword;
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

<style lang="scss" scoped>
@import "../style/style.scss";

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
