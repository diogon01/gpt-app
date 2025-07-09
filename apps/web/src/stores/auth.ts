// apps/web/src/stores/auth.ts
import { defineStore } from 'pinia';
import type { User as FirebaseUser } from 'firebase/auth';
import {
    initializeApp,
    getApps,
} from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';

/* -------------------------------------------------------------------------- */
/* 1. Firebase init (usa variáveis do Vite)                                    */
/* -------------------------------------------------------------------------- */
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
if (!getApps().length) initializeApp(firebaseConfig);
const auth = getAuth();

/* -------------------------------------------------------------------------- */
/* 2. Modelo de usuário da aplicação                                           */
/* -------------------------------------------------------------------------- */
export interface MyUser {
    uid: string;
    displayName: string;
    email: string;
    photoURL?: string;
    provider: 'google' | 'microsoft';
}

/* -------------------------------------------------------------------------- */
/* 3. Pinia store                                                              */
/* -------------------------------------------------------------------------- */
export const useAuth = defineStore('auth', {
    state: () => ({
        user: null as MyUser | null,
        loading: true,
    }),

    actions: {
        /* ---------- mapeia FirebaseUser → MyUser ---------- */
        mapUser(fb: FirebaseUser, provider: MyUser['provider']): MyUser {
            return {
                uid: fb.uid,
                displayName: fb.displayName ?? 'Anonymous',
                email: fb.email ?? 'no-email@unknown',
                photoURL: fb.photoURL ?? undefined,
                provider,
            };
        },

        /* ---------- login Google ---------- */
        async loginGoogle() {
            const cred = await signInWithPopup(auth, new GoogleAuthProvider());
            this.user = this.mapUser(cred.user, 'google');
        },

        /* ---------- login Microsoft ---------- */
        async loginMicrosoft() {
            const provider = new OAuthProvider('microsoft.com');
            const cred = await signInWithPopup(auth, provider);
            this.user = this.mapUser(cred.user, 'microsoft');
        },

        /* ---------- logout ---------- */
        async logout() {
            await signOut(auth);
            this.user = null;
        },

        /* ---------- mantém estado entre refreshes ---------- */
        init() {
            onAuthStateChanged(auth, (fbUser) => {
                this.loading = false;
                if (!fbUser) {
                    this.user = null;
                    return;
                }
                const providerId = fbUser.providerData[0]?.providerId.includes('google')
                    ? 'google'
                    : 'microsoft';
                this.user = this.mapUser(fbUser, providerId as MyUser['provider']);
            });
        },
    },
});
