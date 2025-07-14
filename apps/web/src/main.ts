// apps/web/src/main.ts
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import './index.css';
import router from './router';

import { useAuth } from './stores/useAuthStore';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);     // 1️⃣ Register Pinia before using any store
app.use(router);    // 2️⃣ Register Vue Router

// 3️⃣ Use Pinia instance in store creation (important when calling store outside setup)
const authStore = useAuth();

await authStore.init(); // 4️⃣ Wait until Firebase session is restored

app.mount('#app'); // 5️⃣ Mount the app
