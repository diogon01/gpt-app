// apps/web/src/main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';          // 👈  novo
import './theme.css';
import './index.css';                   // Tailwind
import App from './App.vue';

createApp(App)
    .use(createPinia())                  // Pinia
    .use(router)                         // Vue Router
    .mount('#app');
