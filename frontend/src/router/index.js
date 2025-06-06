// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

import Login from '@/pages/Login.vue';
import Register from '@/pages/Register.vue';
import Dashboard from '@/pages/Dashboard.vue';
import DashboardHome from '@/components/DashboardHome.vue';
import ProfileSettings from '@/components/ProfileSettings.vue';
import StudyBuilder from '@/components/StudyBuilder.vue';
import Participants from '@/components/StudyParticipants.vue';
import StartView from '../components/participants/StartView.vue';
import StudyView from '../components/participants/StudyView.vue';
import ThankYouView from '../components/participants/ThankYouView.vue';


const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  {
    path: '/dashboard',
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
        name: 'StudyBuilder',
        component: StudyBuilder,
      },
      {
        path: 'participants/:studyId',
        name: 'Participants',
        component: Participants,
      },
    ],

  },
  {
    path: '/participant/:participantId',
    children: [
      {
        path: 'start',
        component: StartView,
      },
      {
        path: 'study',
        component: StudyView,
      },
      {
        path: 'thank-you',
        component: ThankYouView,
      },
      {
        path: '',
        redirect: (to) => {
          return `/participant/${to.params.participantId}/start`;
        }
      }
    ]
  },
  { path: '/:catchAll(.*)', redirect: '/login' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // If navigating to a route that requires auth, verify with server
  if (to.meta.requiresAuth) {
    const isAuthenticated = await authStore.checkAuth();
    if (!isAuthenticated) {
      return next('/login');
    }
  }
  
  next();
});


export default router;
