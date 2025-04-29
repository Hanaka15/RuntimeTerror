// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import { useAuthStore } from './store/authStore';
import './style/css/water.css';
import './style/css/style.css';

// Font Awesome imports
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEye, faPenToSquare, faHouse, faUser, faPlus, faBell} from '@fortawesome/free-solid-svg-icons';

// Add icons to the library
library.add(
    faEye, 
    faPenToSquare, 
    faHouse,
    faUser,
    faPlus,
    faBell
);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(createPinia());
app.use(router);

const authStore = useAuthStore();
authStore.fetchUser();

app.mount('#app');
