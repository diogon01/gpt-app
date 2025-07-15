import { MessageRole, UserHistoryEntryEntity } from '@42robotics/domain';
import { HistoryRenameRequestDTO } from '@42robotics/domain/src/dtos/request/history-rename-request.dto';
import { getMongoClient } from '@42robotics/infra/src/config/mongoClient';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = '42r_prompt_results_prod';

export class HistoryService {
  /**
   * Retrieves the user's history sessions sorted by creation date
   * 
   * @param firebaseUid - User UID provided by Firebase authentication
   * @returns Array of mapped user history sessions
   */
  static async getUserHistory(firebaseUid: string): Promise<UserHistoryEntryEntity[]> {
    const db = await getMongoClient();
    const collection = db.collection(COLLECTION_NAME);

    // ✅ Ensure index exists to optimize query on CosmosDB/MongoDB
    await collection.createIndex(
      { userId: 1, createdAt: -1 },
      { background: true, name: 'userId_createdAt_idx' }
    );

    const results = await collection
      .find({ userId: firebaseUid })
      .sort({ createdAt: -1 })
      .toArray();

    return results.map((entry) => ({
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
    }));
  }


  /**
   * Saves a prompt and its response to the history collection
   * 
   * @param userId - User UID
   * @param prompt - The question submitted by the user
   * @param type - Model or use-case type identifier
   * @param response - Raw assistant response
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
  * Renames a single prompt session belonging to the user
  *
  * @param userId - Firebase UID of the user
  * @param sessionId - The session's MongoDB ObjectId as string (_id)
  * @param data - New title passed in the request
  * @returns The result of the update operation
  * @throws Error if session is not found
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
   * Deletes a single prompt session belonging to the user
   *
   * @param userId - Firebase UID of the user
   * @param sessionId - The session's MongoDB ObjectId as string (_id)
   * @returns void
   * @throws Error if session is not found
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
}
