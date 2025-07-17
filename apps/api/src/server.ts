// ✅ Load environment variables before any other imports
import * as dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import {
    env,
    firebaseAuth,
    getMongoClient
} from '@42robotics/infra';

import routes from './routes';


const app = express();

// Apply rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: 60_000,            // 1 minute window
    max: 60,                     // limit each IP to 60 requests per window
    standardHeaders: true,
    legacyHeaders: false,
});

// ──────────────────────────────────────────────────────────────
// MongoDB Connection and Server Startup
// ──────────────────────────────────────────────────────────────
async function startServer() {
    try {
        await getMongoClient(); // Ensures MongoDB connection before middleware

        // ──────────────────────────────────────────────────────────────
        // 1. Global Middleware
        // ──────────────────────────────────────────────────────────────
        app.use(helmet());
        app.use(cors());
        app.use(express.json());
        app.use(limiter as unknown as RequestHandler);

        // ──────────────────────────────────────────────────────────────
        // 2. Firebase Authentication Middleware
        // ──────────────────────────────────────────────────────────────
        app.use(firebaseAuth);

        // ──────────────────────────────────────────────────────────────
        // 3. API Routes
        // ──────────────────────────────────────────────────────────────
        app.use('/api', routes);

        // ──────────────────────────────────────────────────────────────
        // 4. Global Error Handler
        // ──────────────────────────────────────────────────────────────
        app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
            console.error(err); // Log the error
            res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
        });

        app.listen(env.port, () => {
            console.log(`🚀 API running at → http://localhost:${env.port}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

startServer();
