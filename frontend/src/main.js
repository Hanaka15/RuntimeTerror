// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import { useAuthStore } from './store/authStore';

const app = createApp(App);

app.use(createPinia());
app.use(router);

const authStore = useAuthStore();
authStore.fetchUser();

app.mount('#app');
