// packages/domain/src/repositories/UserRepository.ts

import { CreateUserDTO } from "../dtos/create-user.dto";
import { MongoUser } from "../entities/mongo-user";

/**
 * Contract for user persistence operations.
 */
export interface UserRepository {
    findByUid(uid: string): Promise<MongoUser | null>;
    create(data: CreateUserDTO, service: string): Promise<MongoUser>;
    updateToken(uid: string, token: string): Promise<void>;
}
