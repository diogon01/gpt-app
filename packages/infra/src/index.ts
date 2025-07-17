// packages/infra/src/index.ts
export { admin, getApp, getAuth } from './auth/firebaseAdmin'; // ✅ agora "admin" é público
export * from './auth/firebaseAuth';

export * from './config/env';
export * from './config/openai';
