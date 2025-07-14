// apps/web/src/stores/useAuthStore.ts
import {
    getApps,
    initializeApp,
} from 'firebase/app';
import type { User as FirebaseUser } from 'firebase/auth';
import {
    getAuth,
    GoogleAuthProvider,
    OAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
import {
    doc,
    getDoc,
    getFirestore,
} from 'firebase/firestore';
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
const db = getFirestore();

/* -------------------------------------------------------------------------- */
/* Application-level user type                                                */
/* -------------------------------------------------------------------------- */
export interface MyUser {
    uid: string;
    displayName: string;
    email: string;
    photoURL?: string;
    provider: 'google' | 'microsoft';
    isPlus: boolean;
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
        isLoggedIn: (state) => !!state.user,
    },

    actions: {
        /**
         * Maps a Firebase user to the custom app user structure
         */
        async mapUser(fb: FirebaseUser, provider: MyUser['provider']): Promise<MyUser> {
            const isPlus = await this.checkIfUserIsPlus(fb.uid);

            return {
                uid: fb.uid,
                displayName: fb.displayName ?? 'Anonymous',
                email: fb.email ?? 'no-email@unknown',
                photoURL: fb.photoURL ?? undefined,
                provider,
                isPlus,
            };
        },

        /**
         * Google sign-in
         */
        async loginGoogle() {
            const cred = await signInWithPopup(auth, new GoogleAuthProvider());
            this.firebaseUser = cred.user;
            this.user = await this.mapUser(cred.user, 'google');
        },

        /**
         * Microsoft sign-in
         */
        async loginMicrosoft() {
            const provider = new OAuthProvider('microsoft.com');
            const cred = await signInWithPopup(auth, provider);
            this.firebaseUser = cred.user;
            this.user = await this.mapUser(cred.user, 'microsoft');
        },

        /**
         * Logout and clear auth state
         */
        async logout() {
            await signOut(auth);
            this.user = null;
            this.firebaseUser = null;
        },

        /**
         * Initializes Firebase auth listener and waits for session restoration
         */
        async init(): Promise<void> {
            return new Promise((resolve) => {
                onAuthStateChanged(auth, async (fbUser) => {
                    this.loading = false;

                    if (!fbUser) {
                        this.user = null;
                        this.firebaseUser = null;
                        return resolve(); // resolve with null user
                    }

                    const providerId = fbUser.providerData[0]?.providerId.includes('google')
                        ? 'google'
                        : 'microsoft';

                    this.firebaseUser = fbUser;
                    this.user = await this.mapUser(fbUser, providerId as MyUser['provider']);
                    resolve(); // resolve after mapping
                });
            });
        },

        /**
         * Checks if the user has a "plus" subscription plan in Firestore
         */
        async checkIfUserIsPlus(uid: string): Promise<boolean> {
            try {
                const docRef = doc(db, 'users', uid);
                const snapshot = await getDoc(docRef);
                return snapshot.exists() && snapshot.data()?.plan === 'plus';
            } catch (error) {
                console.warn('Failed to check Plus plan:', error);
                return false;
            }
        },
    },
});
