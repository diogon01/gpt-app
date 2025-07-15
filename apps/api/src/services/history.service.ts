import {
  mapHistoryEntryToDTO,
  MessageRole,
  UserHistoryEntryEntity,
} from '@42robotics/domain';
import { HistoryRenameRequestDTO } from '@42robotics/domain/src/dtos/request/history-rename-request.dto';
import { UserHistoryEntryResponseDTO } from '@42robotics/domain/src/dtos/response/user-history-entry-response.dto';
import { getMongoClient } from '@42robotics/infra/src/config/mongoClient';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = '42r_prompt_results_prod';

export class HistoryService {
  /**
   * Retrieves the authenticated user's history sessions sorted by creation date.
   *
   * @param firebaseUid - Unique identifier from Firebase authentication
   * @returns A list of mapped user history session entities
   */
  static async getUserHistory(firebaseUid: string): Promise<UserHistoryEntryEntity[]> {
    const db = await getMongoClient();
    const collection = db.collection(COLLECTION_NAME);

    await collection.createIndex(
      { userId: 1, createdAt: -1 },
      { background: true, name: 'userId_createdAt_idx' }
    );

    const results = await collection
      .find({ userId: firebaseUid })
      .sort({ createdAt: -1 })
      .toArray();

    return results.map((entry) => HistoryService.mapEntryToSession(entry));
  }

  /**
   * Retrieves a specific session by its unique ID and returns a serialized DTO.
   *
   * @param userId - Unique Firebase UID of the user
   * @param sessionId - MongoDB ObjectId of the session
   * @returns {UserHistoryEntryResponseDTO} A single history session serialized as UserHistoryEntryResponseDTO
   * @throws Error if the session does not exist or does not belong to the user
   */
  static async getSessionById(
    userId: string,
    sessionId: string
  ): Promise<UserHistoryEntryResponseDTO> {
    const db = await getMongoClient();
    const collection = db.collection(COLLECTION_NAME);

    const entry = await collection.findOne({
      userId,
      _id: new ObjectId(sessionId),
    });

    if (!entry) {
      throw new Error('SESSION_NOT_FOUND');
    }

    const sessionEntity = HistoryService.mapEntryToSession(entry);
    return mapHistoryEntryToDTO(sessionEntity);
  }

  /**
   * Performs a case-insensitive search across prompt and response fields.
   *
   * @param userId - Unique Firebase UID of the user
   * @param query - Search keyword or phrase
   * @returns A list of matching user history sessions
   */
  static async searchSessions(
    userId: string,
    query: string
  ): Promise<UserHistoryEntryEntity[]> {
    const db = await getMongoClient();
    const collection = db.collection(COLLECTION_NAME);

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');

    const results = await collection
      .find({
        userId,
        $or: [{ prompt: regex }, { response: regex }],
      })
      .sort({ createdAt: -1 })
      .toArray();

    return results.map((entry) => HistoryService.mapEntryToSession(entry));
  }

  /**
   * Saves a user-submitted prompt and its corresponding response to the database.
   *
   * @param userId - Unique Firebase UID of the user
   * @param prompt - The prompt submitted by the user
   * @param type - Type or category of the prompt
   * @param response - The assistant's response to the prompt
   */
  static async savePromptResult({
    userId,
    prompt,
    type,
    response,
  }: {
    userId: string;
    prompt: string;
    type: string;
    response: any;
  }): Promise<void> {
    const db = await getMongoClient();
    const collection = db.collection(COLLECTION_NAME);

    await collection.insertOne({
      userId,
      prompt,
      type,
      response,
      createdAt: new Date(),
    });
  }

  /**
   * Renames a session by updating its prompt/title.
   *
   * @param userId - Unique Firebase UID of the user
   * @param sessionId - The session's MongoDB ObjectId
   * @param data - The new title provided in the request
   * @throws Error if no session was updated
   */
  static async renameSession(
    userId: string,
    sessionId: string,
    data: HistoryRenameRequestDTO
  ): Promise<void> {
    const db = await getMongoClient();
    const collection = db.collection(COLLECTION_NAME);

    const result = await collection.updateOne(
      { userId, _id: new ObjectId(sessionId) },
      { $set: { prompt: data.title } }
    );

    if (result.matchedCount === 0) {
      throw new Error('SESSION_NOT_FOUND');
    }
  }

  /**
   * Deletes a specific session belonging to the user.
   *
   * @param userId - Unique Firebase UID of the user
   * @param sessionId - The session's MongoDB ObjectId
   * @throws Error if no session was deleted
   */
  static async deleteSession(
    userId: string,
    sessionId: string
  ): Promise<void> {
    const db = await getMongoClient();
    const collection = db.collection(COLLECTION_NAME);

    const result = await collection.deleteOne({
      userId,
      _id: new ObjectId(sessionId),
    });

    if (result.deletedCount === 0) {
      throw new Error('SESSION_NOT_FOUND');
    }
  }

  /**
   * Maps a raw MongoDB document into a domain-level UserHistoryEntryEntity.
   *
   * @param entry - Raw MongoDB document from the history collection
   * @returns A normalized UserHistoryEntryEntity
   */
  private static mapEntryToSession(entry: any): UserHistoryEntryEntity {
    return {
      _id: entry._id.toString(),
      timestamp: entry.createdAt,
      messages: [
        {
          role: MessageRole.User,
          content: entry.prompt ?? '',
          timestamp: entry.createdAt,
        },
        {
          role: MessageRole.Assistant,
          content:
            typeof entry.response === 'string'
              ? entry.response
              : JSON.stringify(entry.response),
          timestamp: entry.createdAt,
        },
      ],
    };
  }
}
