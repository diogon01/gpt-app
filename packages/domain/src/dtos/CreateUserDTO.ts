import { AuthTokens } from '../entities/AuthTokens';
import { AuthProvider } from '../enums/AuthProvider';

export interface CreateUserDTO {
    uid: string;
    federatedId: string;
    provider: AuthProvider;
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
