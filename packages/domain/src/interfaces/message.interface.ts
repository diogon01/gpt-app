import { MessageRole } from '../enums/message-role.enum';

export interface Message {
    role: MessageRole;
    content: string;
}
