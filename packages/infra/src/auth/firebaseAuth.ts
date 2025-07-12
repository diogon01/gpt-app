import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { User } from '../database/models/user.model';
import { AuthenticatedRequest, FirebaseDecodedToken } from '../types/firebase';


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

        // Anexar ao request para uso posterior
        req.user = {
            id: decoded.uid,
            email: decoded.email!,
            name: decoded.name,
            picture: decoded.picture,
        };

        // Proteção extra
        if (!decoded.email || !decoded.name) return next();

        // Upsert do usuário no MongoDB (via Mongoose)
        await User.findOneAndUpdate(
            { firebaseUid: decoded.uid },
            {
                firebaseUid: decoded.uid,
                federatedId: decoded.firebase?.identities?.['google.com']?.[0] ?? '',
                providerId: decoded.firebase?.sign_in_provider ?? '',
                email: decoded.email,
                emailVerified: decoded.email_verified ?? false,
                fullName: decoded.name,
                photoUrl: decoded.picture,
                lastLogin: new Date(),
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
    } catch (err) {
        console.warn('⚠️ Firebase auth failed:', (err as Error).message);
    }

    next();
}
