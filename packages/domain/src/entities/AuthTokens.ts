export interface AuthTokens {
    idToken?: string;
    accessToken?: string;         // <- adicionado
    refreshToken: string;
    expiresIn: number;
    oauthAccessToken?: string;
    oauthIdToken?: string;
    oauthExpireIn?: number;
}
