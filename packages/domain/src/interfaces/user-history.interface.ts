import { UserMessage } from "./user-message.interface";


export interface UserHistory {
    firebaseUid: string;
    history: {
        timestamp: Date;
        messages: UserMessage[];
    }[];
    createdAt: Date;
    updatedAt: Date;
}
