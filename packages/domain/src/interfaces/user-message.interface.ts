import { MessageRole } from "../enums/message-role.enum";

export interface UserMessage {
  role: MessageRole;
  content: string;
}