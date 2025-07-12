// packages/infra/src/auth/firebaseAuth.ts
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, FirebaseDecodedToken } from '../types/firebase';
import { admin } from './firebaseAdmin';
import { getMongoClient } from '../config/mongoClient';

/**
 * Middleware to authenticate Firebase token from Authorization header.
 * Adds `req.user` if valid.
 */
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

        if (!decoded.email || !decoded.name) return next();

        // ✅ Usa client nativo, evitando buffering do Mongoose
        const db = await getMongoClient();
        const users = db.collection('42r_users_prod');

        console.log('✅ Firebase user decoded:', decoded.uid);

        await users.updateOne(
            { firebaseUid: decoded.uid },
            {
                $set: {
                    firebaseUid: decoded.uid,
                    federatedId: decoded.firebase?.identities?.['google.com']?.[0] ?? '',
                    providerId: decoded.firebase?.sign_in_provider ?? '',
                    email: decoded.email,
                    emailVerified: decoded.email_verified ?? false,
                    fullName: decoded.name,
                    photoUrl: decoded.picture,
                    lastLogin: new Date(),
                    updatedAt: new Date(),
                },
                $setOnInsert: {
                    createdAt: new Date(),
                },
            },
            { upsert: true }
        );
    } catch (err) {
        console.warn('⚠️ Firebase auth failed:', (err as Error).message);
    }

    next();
}
