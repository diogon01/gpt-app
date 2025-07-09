// apps/api/src/config/firebaseAdmin.ts
import { cert, initializeApp, getApps } from 'firebase-admin/app';
import { env } from './env';

/* -------------------------------------------------------------------------- */
/* 1. Validação de variáveis de ambiente                                       */
/* -------------------------------------------------------------------------- */
const missingVars: string[] = [];
if (!env.fbProjectId) missingVars.push('FB_PROJECT_ID');
if (!env.fbClientEmail) missingVars.push('FB_CLIENT_EMAIL');
if (!env.fbPrivateKey) missingVars.push('FB_PRIVATE_KEY');

if (missingVars.length) {
    throw new Error(`⚠️  Variáveis ausentes no .env: ${missingVars.join(', ')}`);
}

/* -------------------------------------------------------------------------- */
/* 2. Inicialização única do Firebase Admin                                    */
/* -------------------------------------------------------------------------- */
if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: env.fbProjectId,
            clientEmail: env.fbClientEmail,
            // Substitui "\n" literais por quebra de linha real
            privateKey: env.fbPrivateKey.replace(/\\n/g, '\n'),
        }),
    });
    console.log('✅ Firebase Admin inicializado');
}
