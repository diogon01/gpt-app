// packages/domain/src/dtos/user-history-entry-response.dto.ts
import { UserMessageResponseDTO } from './user-message-response.dto';

export interface UserHistoryEntryResponseDTO {
  timestamp: string;
  messages: UserMessageResponseDTO[];
}
