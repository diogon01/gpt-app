// apps/api/src/config/firebaseAdmin.ts
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import * as serviceAccount from '../config/firebase/agro42-service-account.json';

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount as any),
        projectId: serviceAccount.project_id, // opcional mas ajuda com verifyIdToken
    });

    console.log('🔥 Firebase Admin inicializado com Service Account');
}
