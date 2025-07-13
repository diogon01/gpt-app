import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest, FirebaseDecodedToken } from '../types/firebase';
import { admin } from './firebaseAdmin';

// packages/infra/src/auth/firebaseAuth.ts
export function firebaseAuth(req: Request, res: Response, next: NextFunction) {
    (async () => {
        const header = req.headers.authorization;
        if (!header?.startsWith('Bearer ')) return next(); // anonymous

        const idToken = header.split(' ')[1];

        try {
            const decoded = (await admin.auth().verifyIdToken(idToken)) as FirebaseDecodedToken;

            (req as AuthenticatedRequest).user = {
                id: decoded.uid,
                email: decoded.email!,
                name: decoded.name,
                picture: decoded.picture,
            };

            console.log('✅ Firebase user decoded:', decoded.uid);
        } catch (err) {
            console.warn('⚠️ Firebase auth failed:', (err as Error).message);
        }

        next();
    })();
}