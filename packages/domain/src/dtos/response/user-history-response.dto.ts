import { UserHistoryEntryResponseDTO } from "./user-history-entry-response.dto";



/**
 * Represents a single session in the user's conversation history.
 */
export interface UserHistoryResponseDTO {
  firebaseUid: string;
  sessions: UserHistoryEntryResponseDTO[]; // ✅ alterado de "history"
}