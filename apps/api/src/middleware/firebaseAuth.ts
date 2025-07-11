import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { User } from '../models/User';

// ✅ Removido o bloco de initializeApp – a inicialização é feita em config/firebaseAdmin.ts

/**
 * Reads `Authorization: Bearer <ID_TOKEN>` and verifies it with Firebase.
 * If the token is valid, attaches `req.user`; otherwise continues anonymously.
 */
export async function firebaseAuth(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return next(); // no token → anonymous

    const idToken = header.split(' ')[1];
    try {
        const decoded = await admin.auth().verifyIdToken(idToken);

        req.user = {
            id: decoded.uid,
            email: decoded.email!,
            name: decoded.name,
            picture: decoded.picture,
        };

        // Upsert user document for future marketing/prospecting
        await User.findOneAndUpdate(
            { firebaseUid: decoded.uid },
            {
                firebaseUid: decoded.uid,
                federatedId: decoded.firebase?.identities?.['google.com']?.[0] ?? '',
                providerId: decoded.firebase?.sign_in_provider ?? '',
                email: decoded.email!,
                emailVerified: decoded.email_verified ?? false,
                fullName: decoded.name,
                photoUrl: decoded.picture,
                lastLogin: new Date(),
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
    } catch (err) {
        console.warn('Invalid Firebase ID token:', (err as Error).message);
        // Request remains anonymous – do not block the call
    }

    next();
}
