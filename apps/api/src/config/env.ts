// apps/api/src/config/env.ts
import * as dotenv from 'dotenv';
dotenv.config();

export const env = {
    port: Number(process.env.PORT) || 3000,
    mongoUri: process.env.MONGODB_URI || '',
    nodeEnv: process.env.NODE_ENV || 'development',

    // ─── OpenAI / Azure ───────────────────────────────────────
    azureOpenAiKey: process.env.AZURE_OPENAI_KEY || '',
    azureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT || '',
    azureOpenAiDeployment: process.env.AZURE_OPENAI_DEPLOYMENT_GPT || '',

    // ─── Cosmos / Azure ───────────────────────────────────────
    mongoUser: process.env.MONGO_USER || '',
    mongoPass: process.env.MONGO_PASS || '',
    mongoHost: process.env.MONGO_HOST || '',
    mongoPort: process.env.MONGO_PORT || '10255',
    mongoParams: process.env.MONGO_PARAMS || '?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000',
    mongoApp: process.env.MONGO_APP || '',
};
