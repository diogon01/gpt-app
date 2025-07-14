import { UserMessage } from '../interfaces/user-message.interface';

/**
 * Payload for creating a new user history entry.
 */
export interface CreateUserHistoryDTO {
  firebaseUid: string;
  messages: UserMessage[];
}
