// packages/domain/src/entities/user-history-entry.entity.ts
import { UserMessageEntity } from './user-message.entity';

/**
 * A single turn (user + assistant messages) or
 * a single session, depending on how you chunk history.
 */
export interface UserHistoryEntryEntity {
  _id: string;                   // MongoDB ObjectId as string
  timestamp: Date;              // when this turn started
  messages: UserMessageEntity[]; // ordered (user first, assistant second)
}
