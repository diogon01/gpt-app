// apps/api/src/config/mongo.ts

import { MongoClient } from 'mongodb';
import { env } from './env';

const missing: string[] = [];
if (!env.mongoUser) missing.push('MONGO_USER');
if (!env.mongoPass) missing.push('MONGO_PASS');
if (!env.mongoHost) missing.push('MONGO_HOST');
if (!env.mongoPort) missing.push('MONGO_PORT');
if (!env.mongoParams) missing.push('MONGO_PARAMS');
if (!env.mongoApp) missing.push('MONGO_APP');

if (missing.length) {
    throw new Error(`⚠️ Missing .env vars: ${missing.join(', ')}`);
}

const uri = (() => {
    const encoded = encodeURIComponent(env.mongoPass);
    return `mongodb://${env.mongoUser}:${encoded}@${env.mongoHost}:${env.mongoPort}/${env.mongoParams}&appName=${env.mongoApp}`;
})();

let client: MongoClient | null = null;

/** Returns a cached MongoClient (connects once). */
export async function getMongoClient(): Promise<MongoClient> {
    if (!client) {
        client = new MongoClient(uri, {
            useNewUrlParser: true,          // compatibilidade
            useUnifiedTopology: true,       // desativa monitoramento legado
            tls: true,                      // Cosmos DB requer TLS
        } as any); // cast necessário em drivers mais antigos

        await client.connect();
        console.log('✅ MongoDB connected');

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await client?.close();
            console.log('\n👋 Mongo connection closed (SIGINT)');
            process.exit(0);
        });
    }
    return client;
}