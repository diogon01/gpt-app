// packages/domain/src/dtos/user-history-response.dto.ts
import { UserHistoryEntryResponseDTO } from './user-history-entry-response.dto';

/**
 * Represents a single session in the user's conversation history.
 */
export interface UserHistoryResponseDTO {
  firebaseUid: string;
  history: UserHistoryEntryResponseDTO[];
}
