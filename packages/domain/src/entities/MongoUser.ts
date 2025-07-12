// packages/domain/src/entities/MongoUser.ts

import { AuthProvider } from '../enums/AuthProvider';
import { SubscriptionPlan } from '../enums/SubscriptionPlan';
import { SubscriptionStatus } from '../enums/SubscriptionStatus';
import { SubscriptionEvent } from '../enums/SubscriptionEvent';
import { ServiceName } from '../enums/ServiceName';
import { AuthTokens } from './AuthTokens';

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
