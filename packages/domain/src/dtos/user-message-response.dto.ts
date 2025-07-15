// packages/domain/src/dtos/user-message-response.dto.ts
import { MessageRole } from '../enums/message-role.enum';

export interface UserMessageResponseDTO {
  role: MessageRole;
  content: string;
  timestamp: string;
  name?: string;
  function_call?: any;
  tool_call_id?: string;
}
