// packages/domain/src/mappers/verifyAssertionMapper.ts

import { VerifyAssertionDTO } from "../dtos/verify-assertion.dto";
import { AuthTokens } from "../entities/auth-tokens";
import { UserProps } from "../entities/User";

export function mapVerifyAssertion(
    r: VerifyAssertionDTO
): UserProps {
    const tokens: AuthTokens = {
        idToken: r.idToken,
        refreshToken: r.refreshToken,
        expiresIn: Number(r.expiresIn),
        oauthAccessToken: r.oauthAccessToken,
        oauthIdToken: r.oauthIdToken,
        oauthExpireIn: r.oauthExpireIn,
    };

    const now = new Date();

    return {
        uid: r.localId,
        federatedId: r.federatedId,
        provider: r.providerId === 'google.com' ? 'google' : 'microsoft',
        email: r.email,
        emailVerified: r.emailVerified,
        displayName: r.displayName,
        firstName: r.firstName,
        lastName: r.lastName,
        photoURL: r.photoUrl,
        isPlus: false,  // default
        tokens,
        rawProviderInfo: r.rawUserInfo,
        createdAt: now,
        updatedAt: now,
    };
}
