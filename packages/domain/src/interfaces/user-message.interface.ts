import { MessageRole } from "../enums/message-role.enum";

/**
 * Represents a single message exchanged in a conversation,
 * aligned with OpenAI's chat message structure.
 */
export interface UserMessage {
  role: MessageRole;
  content: string;
  name?: string;         // Optional - used in system or function calls
  function_call?: any;   // Optional - for advanced agent interactions
  tool_call_id?: string; // Optional - if tools are involved
  timestamp: Date;
}