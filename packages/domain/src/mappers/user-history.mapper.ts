import { UserHistoryEntryResponseDTO } from '../dtos/response/user-history-entry-response.dto';
import { UserHistoryResponseDTO } from '../dtos/response/user-history-response.dto';
import { UserMessageResponseDTO } from '../dtos/user-message-response.dto';

import { UserHistoryEntity } from '../entities/user-history.entity';
import { UserMessageEntity } from '../entities/user-message.entity';

/**
 * Maps a full UserHistoryEntity from the database into a transport-safe DTO (UserHistoryResponseDTO).
 *
 * @param {UserHistoryEntity} userHistory - The user's complete history retrieved from the persistence layer.
 * @returns {UserHistoryResponseDTO} - A sanitized and serialized DTO representing the user's history.
 */
export function mapUserHistoryToDTO(userHistory: UserHistoryEntity): UserHistoryResponseDTO {
  return {
    firebaseUid: userHistory.userId,
    sessions: userHistory.sessions.map(entry =>
      mapEntryToDTO({
        _id: entry._id.toString(), // ensure _id is stringified
        timestamp: entry.timestamp,
        messages: entry.messages,
      })
    ),
  };
}

/**
 * Converts a single session entry into a format suitable for transport.
 *
 * @param {Object} entry - A session entry containing its unique identifier, timestamp, and related messages.
 * @param {string} entry._id - The MongoDB ObjectId of the session, stringified.
 * @param {Date} entry.timestamp - The timestamp of when the session started.
 * @param {UserMessageEntity[]} entry.messages - List of messages exchanged during the session.
 * @returns {UserHistoryEntryResponseDTO} - A fully mapped DTO session with normalized message contents.
 */
function mapEntryToDTO(entry: {
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
