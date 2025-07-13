// packages/domain/src/dtos/VerifyAssertionDTO.ts
export interface VerifyAssertionDTO {
    providerId: string;
    email: string;
    emailVerified: boolean;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    photoUrl?: string;
    federatedId: string;
    localId: string;          // Firebase UID
    displayName: string;

    idToken: string;
    refreshToken: string;
    expiresIn: string;        // comes as string → convert
    oauthAccessToken?: string;
    oauthIdToken?: string;
    oauthExpireIn?: number;
    rawUserInfo?: string;
}
