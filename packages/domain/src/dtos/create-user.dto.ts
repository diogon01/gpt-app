// packages/domain/src/dtos/CreateUserDTO.ts

import { AuthTokens } from "../entities/AuthTokens";
import { AuthProvider } from "../enums/auth-provider";
import { ServiceName } from "../enums/service-name";
import { SubscriptionEvent } from "../enums/subscription-event";
import { SubscriptionPlan } from "../enums/subscription-plan";
import { SubscriptionStatus } from "../enums/subscription-status";



/**
 * DTO used for creating a new user in the system.
 */
export interface CreateUserDTO {
    uid: string;
    federatedId: string;
    provider: AuthProvider;
    email: string;
    emailVerified: boolean;
    displayName: string;
    fullName?: string; // Optional full name (e.g., for admin reports)

    firstName?: string;
    lastName?: string;
    photoURL?: string;
    isPlus: boolean;

    tokens: AuthTokens;
    rawProviderInfo?: string;

    subscriptions?: {
        [service in ServiceName]?: {
            plan: SubscriptionPlan;
            status: SubscriptionStatus;
            startedAt: Date;
            expiresAt: Date | null;
        };
    };

    subscriptionLogs?: {
        timestamp: Date;
        event: SubscriptionEvent;
        service: ServiceName;
        details?: Record<string, any>;
    }[];

    roles?: string[];
    metadata?: {
        lastLogin: Date;
        [key: string]: any;
    };

    createdAt?: Date;
    updatedAt?: Date;
}
