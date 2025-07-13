import { UserHistoryEntry } from "./user-history-entry.dto";



/**
 * Represents a single session in the user's conversation history.
 */
export interface UserHistoryDTO {
  firebaseUid: string;
  history: UserHistoryEntry[];
}