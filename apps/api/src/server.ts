// apps/api/src/server.ts
import * as dotenv from 'dotenv';
dotenv.config(); // ✅ carregue as variáveis primeiro

// ✅ inicializa o Firebase Admin corretamente (com .env validado)
import './config/firebaseAdmin';

import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { env } from './config/env';
import { getMongoClient } from './config/mongo';
import routes from './routes';
import { firebaseAuth } from './middleware/firebaseAuth';

const app = express();

// ────────────────────────────────────────────────────────────
// 1. Middlewares globais
// ────────────────────────────────────────────────────────────
app.use(helmet());               // segurança
app.use(cors());                 // CORS
app.use(express.json());         // parser JSON

const limiter = rateLimit({
    windowMs: 60_000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter as unknown as RequestHandler);

// ────────────────────────────────────────────────────────────
// 2. Firebase Auth Middleware
// ────────────────────────────────────────────────────────────
app.use(firebaseAuth);

// ────────────────────────────────────────────────────────────
// 3. Rotas da API
// ────────────────────────────────────────────────────────────
app.use('/api', routes);

// ────────────────────────────────────────────────────────────
// 4. Global Error Handler
// ────────────────────────────────────────────────────────────
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal error' });
});

// ────────────────────────────────────────────────────────────
// 5. Conexão com Mongo e Inicialização do Servidor
// ────────────────────────────────────────────────────────────
async function startServer() {
    try {
        await getMongoClient();
        app.listen(env.port, () => {
            console.log(`🚀 API running at → http://localhost:${env.port}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

startServer();
