// apps/api/src/repositories/MongoUserRepository.ts
import { getMongoClient } from '../config/mongo';
import type { CreateUserDTO, User } from '@42robotics/domain';
import { UserRepository } from '@42robotics/domain';

const COLLECTION = 'users';

export class MongoUserRepository implements UserRepository {
    async findByUid(uid: string): Promise<User | null> {
        const cli = await getMongoClient();
        return cli.db().collection<User>(COLLECTION).findOne({ uid });
    }

    async create(data: CreateUserDTO): Promise<User> {
        const cli = await getMongoClient();
        const now = new Date();

        const user: User = {
            ...data,
            isPlus: false,
            createdAt: now,
            updatedAt: now,
        };

        await cli.db().collection<User>(COLLECTION).insertOne(user);
        return user;
    }

    async updateToken(uid: string, token: string): Promise<void> {
        const cli = await getMongoClient();
        await cli.db().collection<User>(COLLECTION).updateOne(
            { uid },
            { $set: { refreshToken: token, updatedAt: new Date() } },
        );
    }
}
