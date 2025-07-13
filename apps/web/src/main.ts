// apps/web/src/main.ts
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import './index.css';
import router from './router';


/* -------------------------------------------------------------------------- */
/* Store de autenticação                                                      */
/* -------------------------------------------------------------------------- */
// Ajuste o caminho conforme o nome real do arquivo
// se for auth.ts → '@/stores/auth'
import { useAuth } from './stores/useAuthStore';
/* -------------------------------------------------------------------------- */
/* Bootstrap                                                                  */
/* -------------------------------------------------------------------------- */
const app = createApp(App);
const pinia = createPinia();

app.use(pinia);    // 1️⃣ registra Pinia (necessário antes do store)
app.use(router);   // 2️⃣ registra Vue Router

// 3️⃣ agora podemos usar o store com Pinia já inicializada
useAuth().init();  // restaura sessão Firebase (não bloqueia a UI)

app.mount('#app'); // 4️⃣ renderiza aplicação
