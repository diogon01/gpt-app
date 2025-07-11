import { AuthTokens } from "./AuthTokens";

// packages/domain/src/entities/User.ts
export interface UserProps {
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

    createdAt: Date;
    updatedAt: Date;
}

export class User {
    constructor(private props: UserProps) { }

    /*  ----------  Getters  ----------  */
    get uid() { return this.props.uid; }
    get email() { return this.props.email; }
    get displayName() { return this.props.displayName; }
    get photoURL() { return this.props.photoURL; }
    get isPlus() { return this.props.isPlus; }
    get provider() { return this.props.provider; }

    /*  ----------  Domain actions  ----------  */
    upgradeToPlus() {
        this.props.isPlus = true;
        this.touch();
    }

    updateTokens(t: AuthTokens) {
        this.props.tokens = t;
        this.touch();
    }

    private touch() {
        this.props.updatedAt = new Date();
    }

    toJSON() { return { ...this.props }; }
}
