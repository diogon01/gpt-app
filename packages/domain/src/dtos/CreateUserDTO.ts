// packages/domain/src/dtos/CreateUserDTO.ts

export interface CreateUserDTO {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    provider: 'google' | 'microsoft';
}
