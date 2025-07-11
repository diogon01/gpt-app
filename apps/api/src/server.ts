// apps/api/src/server.ts
import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import * as dotenv from 'dotenv';

import { env } from './config/env';
import { getMongoClient } from './config/mongo';
import routes from './routes';
import { firebaseAuth } from './middleware/firebaseAuth';

// ────────────────────────────────────────────────────────────
// 1. Load environment variables from .env
// ────────────────────────────────────────────────────────────
dotenv.config();

// ────────────────────────────────────────────────────────────
// 2. Initialize Express app
// ────────────────────────────────────────────────────────────
const app = express();

// Apply security and utility middlewares
app.use(helmet());               // sets security headers
app.use(cors());                 // enable CORS - adjust origin if needed
app.use(express.json());         // parse JSON requests

// Global rate limit: 60 requests per minute per IP
const limiter = rateLimit({
    windowMs: 60_000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter as unknown as RequestHandler);


// ────────────────────────────────────────────────────────────
// 3. Firebase Admin SDK initialization
// ────────────────────────────────────────────────────────────
import admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(), // use GOOGLE_APPLICATION_CREDENTIALS env var
    });
    console.log('✅ Firebase initialized');
}

// ────────────────────────────────────────────────────────────
// 4. Apply custom Firebase authentication middleware
// ────────────────────────────────────────────────────────────
app.use(firebaseAuth); // attaches req.user if a valid token is found

// ────────────────────────────────────────────────────────────
// 5. Routes
// ────────────────────────────────────────────────────────────
app.use('/api', routes); // main API entrypoint

// ────────────────────────────────────────────────────────────
// 6. Global error handler (fallback)
// ────────────────────────────────────────────────────────────
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal error' });
});

// ────────────────────────────────────────────────────────────
// 7. Connect to MongoDB and start server
// ────────────────────────────────────────────────────────────
async function startServer() {
    try {
        await getMongoClient();               // 👈 singleton connects once
        app.listen(env.port, () => {
            console.log(`🚀 API running at → http://localhost:${env.port}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

startServer();
