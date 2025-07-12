import { Db, MongoClient } from 'mongodb';
import { env } from '../config/env';

const missing: string[] = [];
if (!env.mongoUser) missing.push('MONGO_USER');
if (!env.mongoPass) missing.push('MONGO_PASS');
if (!env.mongoHost) missing.push('MONGO_HOST');
if (!env.mongoPort) missing.push('MONGO_PORT');
if (!env.mongoParams) missing.push('MONGO_PARAMS');
if (!env.mongoApp) missing.push('MONGO_APP');
if (!env.mongoDatabase) missing.push('MONGO_DATABASE');

if (missing.length) {
    throw new Error(`⚠️ Missing .env vars: ${missing.join(', ')}`);
}

const uri = (() => {
    const encoded = encodeURIComponent(env.mongoPass);
    return `mongodb://${env.mongoUser}:${encoded}@${env.mongoHost}:${env.mongoPort}/${env.mongoParams}&appName=${env.mongoApp}`;
})();

let db: Db | null = null;

/**
 * Returns a cached Mongo DB instance
 */
export async function getMongoClient(): Promise<Db> {
    if (!db) {
        const client = new MongoClient(uri, {
            tls: true, // ✅ preferido para Cosmos DB
        });

        await client.connect();
        db = client.db(env.mongoDatabase);
        console.log(`🗄️ MongoDB connected to "${env.mongoDatabase}"`);
    }
    return db;
}
