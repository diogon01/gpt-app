import { AuthTokens } from "./auth-tokens";

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

    get uid() { return this.props.uid; }
    get email() { return this.props.email; }
    get displayName() { return this.props.displayName; }
    get photoURL() { return this.props.photoURL; }
    get isPlus() { return this.props.isPlus; }
    get provider() { return this.props.provider; }

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

    toJSON() {
        return { ...this.props };
    }
}
