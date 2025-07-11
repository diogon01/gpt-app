import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

export class AuthService {
    constructor(private readonly userRepository: UserRepository) { }

    async handleLogin(data: CreateUserDTO, token: string): Promise<User> {
        const existingUser = await this.userRepository.findByUid(data.uid);

        if (existingUser) {
            await this.userRepository.updateToken(data.uid, token);
            return existingUser;
        }

        const newUser = await this.userRepository.create({
            ...data,
        });

        await this.userRepository.updateToken(data.uid, token);

        return newUser;
    }
}
