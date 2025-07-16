// apps/web/src/stores/useAuthStore.ts

import { getApps, initializeApp } from 'firebase/app';
import type { User as FirebaseUser } from 'firebase/auth';
import {
    getAuth,
    GoogleAuthProvider,
    OAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
import { defineStore } from 'pinia';

/* -------------------------------------------------------------------------- */
/* Firebase initialization using Vite environment variables                   */
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
/* Application-level user type                                                */
/* -------------------------------------------------------------------------- */
export interface MyUser {
    uid: string;
    displayName: string;
    email: string;
    photoURL?: string;
    provider: 'google' | 'microsoft';
}

/* -------------------------------------------------------------------------- */
/* Auth Store using Pinia                                                     */
/* -------------------------------------------------------------------------- */
export const useAuth = defineStore('auth', {
    state: () => ({
        user: null as MyUser | null,
        firebaseUser: null as FirebaseUser | null,
        loading: true,
    }),

    getters: {
        /**
         * Indicates whether the user is currently logged in.
         * @returns True if authenticated
         */
        isLoggedIn: (state) => !!state.user,
    },

    actions: {
        /**
         * Signs in using Google provider and stores user data.
         */
        async loginGoogle() {
            const cred = await signInWithPopup(auth, new GoogleAuthProvider());
            this.firebaseUser = cred.user;
            this.user = {
                uid: cred.user.uid,
                displayName: cred.user.displayName ?? 'Anonymous',
                email: cred.user.email ?? 'no-email@unknown',
                photoURL: cred.user.photoURL ?? undefined,
                provider: 'google',
            };
        },

        /**
         * Signs in using Microsoft provider and stores user data.
         */
        async loginMicrosoft() {
            const provider = new OAuthProvider('microsoft.com');
            const cred = await signInWithPopup(auth, provider);
            this.firebaseUser = cred.user;
            this.user = {
                uid: cred.user.uid,
                displayName: cred.user.displayName ?? 'Anonymous',
                email: cred.user.email ?? 'no-email@unknown',
                photoURL: cred.user.photoURL ?? undefined,
                provider: 'microsoft',
            };
        },

        /**
         * Signs out the current user and clears store state.
         */
        async logout() {
            await signOut(auth);
            this.user = null;
            this.firebaseUser = null;
        },

        /**
         * Initializes Firebase auth listener and restores user session if available.
         * @returns Promise resolving after initialization completes
         */
        async init(): Promise<void> {
            return new Promise((resolve) => {
                onAuthStateChanged(auth, async (fbUser) => {
                    this.loading = false;

                    if (!fbUser) {
                        this.user = null;
                        this.firebaseUser = null;
                        return resolve();
                    }

                    const providerId = fbUser.providerData[0]?.providerId.includes('google')
                        ? 'google'
                        : 'microsoft';

                    this.firebaseUser = fbUser;
                    this.user = {
                        uid: fbUser.uid,
                        displayName: fbUser.displayName ?? 'Anonymous',
                        email: fbUser.email ?? 'no-email@unknown',
                        photoURL: fbUser.photoURL ?? undefined,
                        provider: providerId as MyUser['provider'],
                    };

                    resolve();
                });
            });
        },
    },
});
