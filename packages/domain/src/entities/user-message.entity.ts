// packages/domain/src/entities/user-message.entity.ts
import { MessageRole } from '../enums/message-role.enum';

/**
 * One chat message (user / assistant / system) in domain form.
 * All timestamps are true Date objects.
 */
export interface UserMessageEntity {
  role: MessageRole | string;
  content: string;
  timestamp: Date;

  /** Optional OpenAI-specific extensions */
  name?: string;
  function_call?: any;
  tool_call_id?: string;
}
