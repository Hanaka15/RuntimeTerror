import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import './style/css/water.css';
import './style/css/style.css';
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

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

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);

app.mount('#app');
