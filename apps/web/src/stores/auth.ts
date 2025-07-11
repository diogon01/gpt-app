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
import {
    getFirestore,
    doc,
    getDoc,
} from 'firebase/firestore';

/* -------------------------------------------------------------------------- */
/* 1. Firebase initialization using Vite environment variables                */
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
/* 2. Application-level user type                                             */
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
/* 3. Auth Store using Pinia                                                  */
/* -------------------------------------------------------------------------- */
export const useAuth = defineStore('auth', {
    state: () => ({
        user: null as MyUser | null,
        firebaseUser: null as FirebaseUser | null, // ✅ armazenar FirebaseUser
        loading: true,
    }),

    actions: {
        /**
         * Maps Firebase user to custom app user
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
         * Login with Google
         */
        async loginGoogle() {
            const cred = await signInWithPopup(auth, new GoogleAuthProvider());
            this.firebaseUser = cred.user; // ✅ salva o firebaseUser
            this.user = await this.mapUser(cred.user, 'google');
        },

        /**
         * Login with Microsoft
         */
        async loginMicrosoft() {
            const provider = new OAuthProvider('microsoft.com');
            const cred = await signInWithPopup(auth, provider);
            this.firebaseUser = cred.user; // ✅ salva o firebaseUser
            this.user = await this.mapUser(cred.user, 'microsoft');
        },

        /**
         * Logout and clear user state
         */
        async logout() {
            await signOut(auth);
            this.user = null;
            this.firebaseUser = null;
        },

        /**
         * Persist auth state between refreshes
         */
        init() {
            onAuthStateChanged(auth, async (fbUser) => {
                this.loading = false;

                if (!fbUser) {
                    this.user = null;
                    this.firebaseUser = null;
                    return;
                }

                const providerId = fbUser.providerData[0]?.providerId.includes('google')
                    ? 'google'
                    : 'microsoft';

                this.firebaseUser = fbUser; // ✅ persiste após refresh
                this.user = await this.mapUser(fbUser, providerId as MyUser['provider']);
            });
        },

        /**
         * Check if user has "plus" plan by querying Firestore
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
