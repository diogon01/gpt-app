// packages/domain/src/entities/MongoUser.ts

import { AuthProvider } from "../enums/auth-provider";
import { ServiceName } from "../enums/service-name";
import { SubscriptionEvent } from "../enums/subscription-event";
import { SubscriptionPlan } from "../enums/subscription-plan";
import { SubscriptionStatus } from "../enums/subscription-status";
import { AuthTokens } from "./auth-tokens";


/**
 * MongoDB user document structure used internally.
 */
export interface MongoUser {
    _id?: any; // MongoDB ObjectId
    uid: string;
    federatedId: string;
    provider: AuthProvider;
    email: string;
    emailVerified: boolean;
    displayName: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    photoURL?: string;
    isPlus: boolean;

    tokens: AuthTokens;
    rawProviderInfo?: string;

    subscriptions: {
        [service in ServiceName]?: {
            plan: SubscriptionPlan;
            status: SubscriptionStatus;
            startedAt: Date;
            expiresAt: Date | null;
        };
    };

    subscriptionLogs: {
        timestamp: Date;
        event: SubscriptionEvent;
        service: ServiceName;
        plan: SubscriptionPlan
        details?: Record<string, any>;

    }[];

    roles: string[];
    metadata: {
        lastLogin: Date;
        [key: string]: any;
    };

    createdAt: Date;
    updatedAt: Date;
}
