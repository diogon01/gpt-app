// apps/web/src/main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import router from './router';
import './index.css';
import App from './App.vue';


/* -------------------------------------------------------------------------- */
/* Store de autenticação                                                      */
/* -------------------------------------------------------------------------- */
// Ajuste o caminho conforme o nome real do arquivo
// se for auth.ts → '@/stores/auth'
import { useAuth } from './stores/auth';
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
