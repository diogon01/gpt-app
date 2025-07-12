import { getMongoClient } from '@42robotics/infra/src/database/config/mongoClient';
import { ServiceName, UserRepository } from '@42robotics/domain';
import { CreateUserDTO } from '@42robotics/domain';
import { MongoUser } from '@42robotics/domain';
import { SubscriptionPlan } from '@42robotics/domain';
import { SubscriptionStatus } from '@42robotics/domain';
import { SubscriptionEvent } from '@42robotics/domain';

export class MongoUserRepository implements UserRepository {
    private readonly collectionName = '42r_users_prod';

    async findByUid(uid: string): Promise<MongoUser | null> {
        const db = await getMongoClient();
        const user = await db.collection<MongoUser>(this.collectionName).findOne({ uid });
        return user;
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
        await db.collection(this.collectionName).updateOne(
            { uid },
            {
                $set: {
                    'tokens.accessToken': token,
                    updatedAt: new Date(),
                },
            }
        );
    }
}
