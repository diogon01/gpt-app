import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { User } from "../entities/User";

export interface UserRepository {
    findByUid(uid: string): Promise<User | null>;
    create(data: CreateUserDTO): Promise<User>;
    updateToken(uid: string, token: string): Promise<void>;
}