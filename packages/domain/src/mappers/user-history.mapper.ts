import { UserHistoryEntryResponseDTO } from '../dtos/response/user-history-entry-response.dto';
import { UserHistoryResponseDTO } from '../dtos/response/user-history-response.dto';
import { UserMessageResponseDTO } from '../dtos/user-message-response.dto';

import { UserHistoryEntity } from '../entities/user-history.entity';
import { UserMessageEntity } from '../entities/user-message.entity';

/**
 * Maps a full UserHistoryEntity from the database into a transport-safe DTO (UserHistoryResponseDTO).
 *
 * @param userHistory - The user's complete history retrieved from the persistence layer.
 * @returns A sanitized and serialized DTO representing the user's history.
 */
export function mapUserHistoryToDTO(userHistory: UserHistoryEntity): UserHistoryResponseDTO {
  return {
    firebaseUid: userHistory.userId,
    sessions: userHistory.sessions.map(entry =>
      mapHistoryEntryToDTO({
        _id: entry._id.toString(),
        timestamp: entry.timestamp,
        messages: entry.messages,
      })
    ),
  };
}

/**
 * Maps a single session entry into a transport-safe DTO (UserHistoryEntryResponseDTO).
 *
 * @param entry - A session entry containing its unique identifier, timestamp, and message list.
 * @returns A fully mapped DTO session with normalized message contents.
 */
export function mapHistoryEntryToDTO(entry: {
  _id: string;
  timestamp: Date;
  messages: UserMessageEntity[];
}): UserHistoryEntryResponseDTO {
  const userMessage = entry.messages.find((m) => m.role === 'user');
  const assistantMessage = entry.messages.find((m) => m.role === 'assistant');

  let parsedContent = '';

  try {
    const parsed = JSON.parse(assistantMessage?.content || '');
    parsedContent = parsed.choices?.[0]?.message?.content || '';
  } catch {
    parsedContent = assistantMessage?.content || '';
  }

  const mappedMessages: UserMessageResponseDTO[] = [
    ...(userMessage
      ? [{
        ...userMessage,
        timestamp: userMessage.timestamp.toISOString(),
      }]
      : []),
    ...(assistantMessage
      ? [{
        ...assistantMessage,
        content: parsedContent,
        timestamp: assistantMessage.timestamp.toISOString(),
      }]
      : []),
  ];

  return {
    _id: entry._id,
    timestamp: entry.timestamp.toISOString(),
    messages: mappedMessages,
  };
}
