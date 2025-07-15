import { mapUserHistoryToDTO } from '@42robotics/domain/src/mappers/user-history.mapper';
import { RequestHandler } from 'express';
import { HistoryService } from '../services/history.service';

/**
 * GET /history
 *
 * Retrieves the user's conversation history, maps it to a DTO, and returns it.
 * 
 * @param req - Express request object, expects authenticated user in req.user
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 * 
 * @returns JSON response containing user's chat history
 */
export const getUserHistory: RequestHandler = async (req, res, next) => {
  try {
    console.log('📥 [getUserHistory] Incoming request');

    if (!req.user?.id) {
      console.warn('⚠️ [getUserHistory] Unauthorized access attempt');
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    console.log(`🔐 [getUserHistory] Authenticated user: ${req.user.id}`);

    const rawHistory = await HistoryService.getUserHistory(req.user.id);
    console.log(`📦 [getUserHistory] Found ${rawHistory.length} history entries`);

    const response = mapUserHistoryToDTO({
      userId: req.user.id,
      sessions: rawHistory,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('✅ [getUserHistory] Sending mapped response');
    res.status(200).json(response);
  } catch (error) {
    console.error('❌ [getUserHistory] Error:', error);
    next(error);
  }
};
