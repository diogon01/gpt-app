import { UserMessage } from "../interfaces/user-message.interface";

export interface UserHistoryEntry {
  timestamp: string;
  messages: UserMessage[];
}