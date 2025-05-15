// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/authStore';

import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Dashboard from '../pages/Dashboard.vue';
import AnswerQuiz from '../components/AnswerStudy.vue';
import DashboardHome from '../components/DashboardHome.vue';
import ProfileSettings from '../components/ProfileSettings.vue';
import CreateStudy from '../components/CreateStudy.vue';

const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: DashboardHome,
      },
      {
        path: 'settings',
        name: 'Settings',
        component: ProfileSettings,
      },
      {
        path: 'create',
        name: 'CreateStudy',
        component: CreateStudy,
      },
      {
        path: 'edit/:study_id',
        name: 'EditStudy',
        component: CreateStudy,
        meta: { requiresAuth: true },
      },
    ], 
  },
  { path: '/session/:study_id', name: 'AnswerStudy', component: AnswerQuiz, meta: { requiresAuth: false } },
  { path: '/:catchAll(.*)', redirect: '/login' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuth = !!authStore.user;
  if (to.meta.requiresAuth && !isAuth) {
    return next('/login');
  }
  next();
});


export default router;
