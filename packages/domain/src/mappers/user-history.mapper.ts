import { UserHistoryEntryResponseDTO } from '../dtos/user-history-entry-response.dto';
import { UserHistoryResponseDTO } from '../dtos/user-history-response.dto';
import { UserMessageResponseDTO } from '../dtos/user-message-response.dto';

import { UserHistoryEntity } from '../entities/user-history.entity';
import { UserMessageEntity } from '../entities/user-message.entity';

/**
 * Maps a full UserHistoryEntity from the database into a transport-safe DTO (UserHistoryResponseDTO).
 *
 * @param {UserHistoryEntity} userHistory - The user's complete history retrieved from persistence layer.
 * @returns {UserHistoryResponseDTO} - The sanitized and serialized user history.
 */
export function mapUserHistoryToDTO(userHistory: UserHistoryEntity): UserHistoryResponseDTO {
  return {
    firebaseUid: userHistory.userId,
    history: userHistory.sessions.map(entry => mapEntryToDTO(entry)),
  };
}

/**
 * Converts a session entry from the database into a DTO-compliant structure with stringified timestamps.
 *
 * @param {Object} entry - A session entry containing the timestamp and associated messages.
 * @param {Date} entry.timestamp - The timestamp of the conversation session.
 * @param {UserMessageEntity[]} entry.messages - Array of messages exchanged during the session.
 * @returns {UserHistoryEntryResponseDTO} - The mapped session entry formatted for transport.
 */
function mapEntryToDTO(entry: { timestamp: Date; messages: UserMessageEntity[] }): UserHistoryEntryResponseDTO {
  const userMessage = entry.messages.find(m => m.role === 'user');
  const assistantMessage = entry.messages.find(m => m.role === 'assistant');

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
    timestamp: entry.timestamp.toISOString(),
    messages: mappedMessages,
  };
}
