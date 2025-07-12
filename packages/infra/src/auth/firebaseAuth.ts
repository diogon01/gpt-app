import { NextFunction } from "express";
import { AuthenticatedRequest, FirebaseDecodedToken } from "../types/firebase";
import { admin } from "./firebaseAdmin";

// packages/infra/src/auth/firebaseAuth.ts
export async function firebaseAuth(
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return next(); // anonymous

    const idToken = header.split(' ')[1];

    try {
        const decoded = (await admin.auth().verifyIdToken(idToken)) as FirebaseDecodedToken;

        req.user = {
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
}
