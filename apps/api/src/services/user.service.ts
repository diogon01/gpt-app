// apps/api/src/services/user.service.ts
import {
    CreateUserDTO,
    ServiceName,
    SubscriptionPlan,
    SubscriptionStatus,
} from '@42robotics/domain';
import { getMongoClient } from '@42robotics/infra';

export class UserService {
    static async upsertUser(data: CreateUserDTO, service: ServiceName) {
        const db = await getMongoClient();
        const users = db.collection('42r_users_prod');

        const now = new Date();

        // ⚠️ Garante que o nome do serviço é seguro para ser usado como chave
        if (service.includes('.')) {
            throw new Error(`Invalid service name: "${service}"`);
        }

        const set: any = {
            email: data.email,
            displayName: data.displayName,
            photoURL: data.photoURL,
            provider: data.provider,
            federatedId: data.federatedId,
            emailVerified: data.emailVerified,
            isPlus: data.isPlus,
            rawProviderInfo: data.rawProviderInfo,
            metadata: { lastLogin: now },
            updatedAt: now,
        };

        const setOnInsert: any = {
            uid: data.uid,
            tokens: data.tokens,
            roles: ['client'],
            createdAt: now,
        };

        // Atribui dinamicamente os campos da assinatura
        set[`subscriptions.${service}.status`] = SubscriptionStatus.ACTIVE;
        set[`subscriptions.${service}.updatedAt`] = now;

        setOnInsert[`subscriptions.${service}.plan`] = SubscriptionPlan.FREE;
        setOnInsert[`subscriptions.${service}.startedAt`] = now;
        setOnInsert[`subscriptions.${service}.expiresAt`] = null;

        const result = await users.updateOne(
            { uid: data.uid },
            {
                $set: set,
                $setOnInsert: setOnInsert,
            },
            { upsert: true }
        );

        if (result.upsertedCount > 0) {
            console.log(`👤 New user inserted [${service}]: ${data.email}`);
        } else {
            console.log(`🔁 Existing user updated [${service}]: ${data.email}`);
        }
    }
}
