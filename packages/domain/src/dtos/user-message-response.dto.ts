// packages/domain/src/dtos/user-message-response.dto.ts

export interface UserMessageResponseDTO {
  role: any;
  content: string;
  timestamp: string;
  name?: string;
  function_call?: any;
  tool_call_id?: string;
}
