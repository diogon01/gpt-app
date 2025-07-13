import { MessageRole, UserHistoryDTO } from '@42robotics/domain';
import { UserHistoryEntry } from '@42robotics/domain/src/dtos/user-history-entry.dto';
import { PromptResult } from '@42robotics/infra/src/database/models/prompt-result.model';
import { RequestHandler } from 'express';

export const getUserHistory: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const results = await PromptResult.find({ userId: req.user.id }).sort({ createdAt: -1 });

    const history: UserHistoryEntry[] = results.map((entry) => ({
      timestamp: entry.createdAt,
      messages: [
        {
          role: MessageRole.User,
          content: entry.prompt ?? '',
          timestamp: entry.createdAt
        },
        {
          role: MessageRole.Assistant,
          content:
            typeof entry.response === 'string'
              ? entry.response
              : JSON.stringify(entry.response),
          timestamp: entry.createdAt
        }
      ]
    }));


    const response: UserHistoryDTO = {
      firebaseUid: req.user.id,
      history,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
