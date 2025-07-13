import { UserMessage } from "../interfaces/user-message.interface";

export interface UserHistoryEntry {
  timestamp: Date;
  messages: UserMessage[];
}