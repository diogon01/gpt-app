import { Message } from './message.interface';

/**
 * Represents a user's historical conversation in the domain layer.
 */
export interface UserHistory {
    firebaseUid: string;
    history: {
        timestamp: Date;
        messages: Message[];
    }[];
    createdAt: Date;
    updatedAt: Date;
}
