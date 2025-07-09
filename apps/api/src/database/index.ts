// apps/api/src/database/index.ts

import mongoose from 'mongoose';
import { mongoUri } from '../config/mongo';

mongoose.set('strictQuery', true);

/**
 * Conecta ao banco de dados MongoDB usando Mongoose.
 */
export async function connectMongo(): Promise<void> {
    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 30000,
        });
        console.log('✅ MongoDB conectado com sucesso');
    } catch (error) {
        console.error('❌ Erro ao conectar no MongoDB:', error);
        throw error;
    }
}

/**
 * Fecha a conexão com o MongoDB ao encerrar a aplicação.
 */
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('\n👋 Conexão com MongoDB encerrada (SIGINT)');
    process.exit(0);
});
