// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/authStore';

import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Dashboard from '../pages/Dashboard.vue';
import AnswerQuiz from '../components/AnswerStudy.vue';

const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/participate/:study_id', name: 'AnswerStudy', component: AnswerQuiz, meta: { requiresAuth: false } },
  { path: '/:catchAll(.*)', redirect: '/login' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Only fetch if user is not already set
  if (!authStore.user) {
    try {
      await authStore.fetchUser();
    } catch (err) {
      console.warn('User not authenticated');
    }
  }

  const isAuth = !!authStore.user;

  if (to.meta.requiresAuth && !isAuth) {
    return next('/login');
  }

  return next();
});

export default router;
