import { MessageRole, UserHistoryEntry } from '@42robotics/domain';
import { getMongoClient } from '@42robotics/infra/src/config/mongoClient';

export class HistoryService {
  static async getUserHistory(firebaseUid: string): Promise<UserHistoryEntry[]> {
    const db = await getMongoClient();
    const collection = db.collection('42r_prompt_results_prod');

    const results = await collection
      .find({ userId: firebaseUid })
      .sort({ createdAt: -1 })
      .toArray();

    return results.map((entry) => ({
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
    const collection = db.collection('42r_prompt_results_prod');

    await collection.insertOne({
      userId,
      prompt,
      type,
      response,
      createdAt: new Date(),
    });
  }
}
