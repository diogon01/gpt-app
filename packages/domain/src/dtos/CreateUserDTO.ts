import { AuthTokens } from '../entities/AuthTokens';

export interface CreateUserDTO {
    uid: string;
    federatedId: string;
    provider: 'google' | 'microsoft';
    email: string;
    emailVerified: boolean;
    displayName: string;
    firstName?: string;
    lastName?: string;
    photoURL?: string;
    isPlus: boolean;

    tokens: AuthTokens;
    rawProviderInfo?: string;
}
