import { Request } from 'express';

export interface FirebaseDecodedToken {
    uid: string;
    email?: string;
    name?: string;
    picture?: string;
    email_verified?: boolean;
    firebase?: {
        identities?: { [key: string]: string[] };
        sign_in_provider?: string;
    };
}

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        name?: string;
        picture?: string;
    };
}
