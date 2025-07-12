// packages/infra/src/auth/firebaseAdmin.ts
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../config/agro42-service-account.json';

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount as any),
        projectId: serviceAccount.project_id,
    });

    console.log('🔥 Firebase Admin initialized');
}

export { admin, getAuth, getApp };
