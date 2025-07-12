// apps/api/src/services/user.service.ts
import {
    CreateUserDTO,
    ServiceName,
    SubscriptionPlan,
    SubscriptionStatus,
} from '@42robotics/domain';
import { getMongoClient } from '@42robotics/infra/src/config/mongoClient';

export class UserService {
    static async upsertUser(data: CreateUserDTO, service: ServiceName) {

        const db = await getMongoClient();
        const users = db.collection('42r_users_prod');
        const existing = await users.findOne({ uid: data.uid });


        if (!existing) {
            await users.insertOne({
                ...data,
                subscriptions: {
                    [service]: {
                        plan: SubscriptionPlan.FREE,
                        status: SubscriptionStatus.ACTIVE,
                        startedAt: new Date(),
                        expiresAt: null
                    },
                },
                roles: ['client'],
                metadata: {
                    lastLogin: new Date(),
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log(`👤 New user inserted [${service}]: ${data.email}`);
        } else {
            await users.updateOne(
                { uid: data.uid },
                {
                    $set: {
                        [`subscriptions.${service}.status`]: SubscriptionStatus.ACTIVE,
                        [`subscriptions.${service}.updatedAt`]: new Date(),
                        'metadata.lastLogin': new Date(),
                        updatedAt: new Date(),
                    },
                    $setOnInsert: {
                        [`subscriptions.${service}.startedAt`]: new Date(),
                    },
                },
                { upsert: true }
            );
        }
    }
}
