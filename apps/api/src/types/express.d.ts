// This file is picked up automatically by TypeScript
// and merges with the existing Express namespace.
import 'express';

declare global {
    namespace Express {
        /**  Minimal subset – add more fields if you need them elsewhere */
        interface AuthUser {
            id: string;          // Firebase UID
            email: string;
            name?: string;
            picture?: string;
        }

        // Make `req.user` available in controllers
        interface Request {
            user?: AuthUser;
        }
    }
}
