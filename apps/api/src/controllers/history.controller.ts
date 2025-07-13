import { UserHistoryEntry } from '@42robotics/domain';
import { PromptResult } from '@42robotics/infra/src/database/models/prompt-result.model';
import { RequestHandler } from 'express';

export const getUserHistory: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Aqui você busca os dados no Mongo
    const results = await PromptResult.find({ userId: req.user.id }).sort({ createdAt: -1 });

    const history: UserHistoryEntry[] = results.map((entry) => ({
      timestamp: entry.createdAt,
      messages: [
        { role: 'user', content: entry.prompt },
        { role: 'assistant', content: typeof entry.response === 'string' ? entry.response : JSON.stringify(entry.response) }
      ]
    }));

    return res.status(200).json({ history });
  } catch (error) {
    next(error);
  }
};