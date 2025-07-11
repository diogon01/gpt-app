import * as dotenv from 'dotenv';
dotenv.config();

export const env = {
    /* ───────── Server ───────── */
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',

    /* ───────── Azure OpenAI ───────── */
    azureOpenAiKey: process.env.AZURE_OPENAI_KEY || '',
    azureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT || '',
    azureOpenAiVersion: process.env.AZURE_OPENAI_VERSION || '2025-01-01-preview',

    /* ───────── Mongo / Cosmos (opcionais) ───────── */
    mongoUri: process.env.MONGODB_URI || '',
    mongoUser: process.env.MONGO_USER || '',
    mongoPass: process.env.MONGO_PASS || '',
    mongoHost: process.env.MONGO_HOST || '',
    mongoPort: process.env.MONGO_PORT || '10255',
    mongoParams: process.env.MONGO_PARAMS ||
        '?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000',
    mongoApp: process.env.MONGO_APP || '',
    mongoDatabase: process.env.MONGO_DATABASE || '',

    /* ───────── Firebase (opcional) ───────── */
    fbProjectId: process.env.FB_PROJECT_ID || '',
    fbClientEmail: process.env.FB_CLIENT_EMAIL || '',
    fbPrivateKey: process.env.FB_PRIVATE_KEY || ''
};
