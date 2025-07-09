import { env } from './env';

const missingVars: string[] = [];

if (!env.mongoUser) missingVars.push('MONGO_USER');
if (!env.mongoPass) missingVars.push('MONGO_PASS');
if (!env.mongoHost) missingVars.push('MONGO_HOST');
if (!env.mongoPort) missingVars.push('MONGO_PORT');
if (!env.mongoParams) missingVars.push('MONGO_PARAMS');
if (!env.mongoApp) missingVars.push('MONGO_APP');

if (missingVars.length > 0) {
    throw new Error(`⚠️  Variáveis ausentes no .env: ${missingVars.join(', ')}`);
}

export const mongoUri = (() => {
    const encodedPass = encodeURIComponent(env.mongoPass);
    const credentials = `${env.mongoUser}:${encodedPass}`;
    const hostPort = `${env.mongoHost}:${env.mongoPort}`;
    const tail = `${env.mongoParams}&appName=${env.mongoApp}`;
    return `mongodb://${credentials}@${hostPort}/${tail}`;
})();
