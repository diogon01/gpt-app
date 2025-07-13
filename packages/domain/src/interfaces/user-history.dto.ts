import { UserMessage } from '../interfaces/user-message.interface';

export interface UserHistoryEntry {
  timestamp: Date;
  messages: UserMessage[];
}

export interface CreateUserHistoryDTO {
  firebaseUid: string;
  history: UserHistoryEntry[];
}
