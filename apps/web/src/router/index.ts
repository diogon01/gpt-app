
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuth } from '../stores/useAuthStore';

/**
 * Application route definitions.
 * Each route maps a path to its corresponding view component.
 */
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/HomeView.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
    },
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('@/views/AdminView.vue'),
    },
    {
        path: '/layout',
        name: 'LayoutTest',
        component: () => import('@/views/LayoutTest.vue'),
    },
    {
        path: '/history/:_id',
        name: 'HistorySession',
        component: () => import('@/views/HomeView.vue'),
        meta: { requiresAuth: true }, // Protected route: requires Firebase user authentication
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    },
];

/**
 * Vue Router instance with HTML5 history mode.
 */
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior: () => ({ top: 0 }),
});

/**
 * Global route guard to protect routes that require authentication.
 * Waits for Firebase auth state to resolve before allowing navigation.
 */
router.beforeEach(async (to, _from, next) => {
    const authStore = useAuth();

    // Wait for Firebase user to initialize if undefined
    if (authStore.firebaseUser === undefined) {
        await new Promise((resolve) => {
            const unsubscribe = authStore.$subscribe(() => {
                if (authStore.firebaseUser !== undefined) {
                    unsubscribe();
                    resolve(null);
                }
            });
        });
    }

    // Redirect to login if trying to access a protected route without authentication
    if (to.meta.requiresAuth && !authStore.firebaseUser) {
        next({ name: 'Login' });
    } else {
        next();
    }
});

export default router;
