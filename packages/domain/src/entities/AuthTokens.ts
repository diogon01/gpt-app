// packages/domain/src/entities/AuthTokens.ts
export interface AuthTokens {
    idToken: string;
    refreshToken: string;
    expiresIn: number;          // seconds
    oauthAccessToken?: string;
    oauthIdToken?: string;
    oauthExpireIn?: number;     // seconds
}
