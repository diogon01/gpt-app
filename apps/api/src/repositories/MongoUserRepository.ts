import {
    CreateUserDTO,
    MongoUser,
    ServiceName,
    SubscriptionPlan,
    SubscriptionStatus,
    SubscriptionEvent,
    UserRepository
} from '@42robotics/domain';

import { getMongoClient } from '@42robotics/infra/src/config/mongoClient';

export class MongoUserRepository implements UserRepository {
    private readonly collectionName = process.env.MONGO_USERS_COLLECTION ?? '42r_users_prod';

    async findByUid(uid: string): Promise<MongoUser | null> {
        const db = await getMongoClient();
        return db.collection<MongoUser>(this.collectionName).findOne({ uid });
    }

    async create(data: CreateUserDTO, service: ServiceName): Promise<MongoUser> {
        const db = await getMongoClient();
        const now = new Date();

        const user: MongoUser = {
            ...data,
            fullName: data.displayName,
            subscriptions: {
                [service]: {
                    plan: SubscriptionPlan.FREE,
                    status: SubscriptionStatus.ACTIVE,
                    startedAt: now,
                    expiresAt: null,
                },
            },
            subscriptionLogs: [
                {
                    service,
                    event: SubscriptionEvent.CREATED,
                    timestamp: now,
                    plan: SubscriptionPlan.FREE,
                },
            ],
            roles: ['client'],
            metadata: {
                lastLogin: now,
            },
            createdAt: now,
            updatedAt: now,
        };

        await db.collection(this.collectionName).insertOne(user);
        return user;
    }

    async updateToken(uid: string, token: string): Promise<void> {
        const db = await getMongoClient();
        const result = await db.collection(this.collectionName).updateOne(
            { uid },
            {
                $set: {
                    'tokens.accessToken': token,
                    updatedAt: new Date(),
                },
            }
        );

        if (result.matchedCount === 0) {
            console.warn(`⚠️ No user found with uid=${uid} to update token`);
        }
    }
}
