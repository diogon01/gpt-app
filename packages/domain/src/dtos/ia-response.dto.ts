import { MessageRole } from "../enums/message-role.enum";

export interface IAChoice {
  index: number;
  message: {
    role: MessageRole;
    content: string;
  };
  finish_reason: string;
}

export interface IAResponseDTO {
  _id?: string;
  id: string;
  object: string;
  created: number;
  model: string;
  choices: IAChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
