import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    { path: '/', name: 'Home', component: () => import('@/views/HomeView.vue') },
    { path: '/login', name: 'Login', component: () => import('@/views/LoginView.vue') },
    { path: '/resultados', name: 'Resultados', component: () => import('@/views/ResultadosView.vue') },
    { path: '/admin', name: 'Admin', component: () => import('@/views/AdminView.vue') },

    // ▶ NOVO TESTE
    { path: '/layout', name: 'LayoutTest', component: () => import('@/views/LayoutTest.vue') },

    { path: '/:pathMatch(.*)*', redirect: '/' }
];

export default createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior: () => ({ top: 0 }),
});
