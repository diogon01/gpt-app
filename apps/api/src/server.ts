// apps/api/src/server.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import routes from './routes';

// ────────────────────────────────────────────────────────────
// 1.  Carrega variáveis de ambiente (.env)
// ────────────────────────────────────────────────────────────
dotenv.config();

// ────────────────────────────────────────────────────────────
// 2.  Inicializa app
// ────────────────────────────────────────────────────────────
const app = express();

// Segurança & utilitários
app.use(helmet());                // cabeçalhos de segurança
app.use(cors());                  // libera CORS - ajuste origin se precisar
app.use(express.json());          // parse JSON

// Limite global de 60 req/min por IP (ajuste conforme necessidade)
const limiter = rateLimit({ windowMs: 60_000, max: 60 });
app.use(limiter);

// ────────────────────────────────────────────────────────────
// 3.  Rotas
// ────────────────────────────────────────────────────────────

app.use('/api', routes);          // IA + demais endpoints

// ────────────────────────────────────────────────────────────
// 4.  Middleware de erro (captura finais)
// ────────────────────────────────────────────────────────────
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal error' });
});

// ────────────────────────────────────────────────────────────
// 5.  Conecta ao MongoDB e inicia servidor
// ────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.MONGODB_URI || '';

async function start() {
    try {
        if (!MONGO_URI) {
            console.warn('⚠️  MONGODB_URI not set – skipping DB connection');
        } else {
            await mongoose.connect(MONGO_URI);
            console.log('✅ MongoDB connected');
        }

        app.listen(PORT, () =>
            console.log(`🚀 API ready → http://localhost:${PORT}`)
        );
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

start();
