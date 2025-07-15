// packages/domain/src/entities/user-history.entity.ts
import { UserHistoryEntryEntity } from './user-history-entry.entity';

/**
 * Complete stored history for one Firebase user.
 */
export interface UserHistoryEntity {
    userId: string;                         // Firebase UID
    sessions: UserHistoryEntryEntity[];  // rename from "history"
    createdAt: Date;
    updatedAt: Date;
}
