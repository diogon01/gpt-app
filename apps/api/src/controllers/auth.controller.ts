import { RequestHandler } from 'express';
import admin from 'firebase-admin';
import {
    CreateUserDTO,
    AuthTokens,
    AuthProvider,
    ServiceName,
} from '@42robotics/domain';
import { UserService } from '../services/user.service';

export const handleAuthSync: RequestHandler = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Missing or invalid Authorization header' });
            return;
        }

        const idToken = authHeader.split(' ')[1];
        const decoded = await admin.auth().verifyIdToken(idToken);

        const uid = decoded.uid;
        const email = decoded.email || '';
        const name = decoded.name || 'Anonymous';
        const photoURL = decoded.picture || '';
        const provider = decoded.firebase.sign_in_provider;
        const federatedId = decoded.firebase.identities?.[provider]?.[0] ?? '';
        const emailVerified = decoded.email_verified ?? false;
        const rawProviderInfo = JSON.stringify(decoded.firebase);

        const tokens: AuthTokens = {
            accessToken: idToken,
            refreshToken: '',
            expiresIn: 3600,
        };

        const rawProvider = provider.toLowerCase();
        if (rawProvider !== AuthProvider.GOOGLE && rawProvider !== AuthProvider.MICROSOFT) {
            throw new Error(`Unsupported provider: ${rawProvider}`);
        }

        const newUser: CreateUserDTO = {
            uid,
            displayName: name,
            email,
            photoURL,
            provider: rawProvider as AuthProvider,
            federatedId,
            emailVerified,
            isPlus: false,
            tokens,
            rawProviderInfo,
        };

        const service: ServiceName = req.body?.service || ServiceName.IA;

        await UserService.upsertUser(newUser, service);

        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('❌ Auth sync error:', error);
        next(error);
    }
};
