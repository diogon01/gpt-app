import { UserHistoryDTO } from '@42robotics/domain';
import { RequestHandler } from 'express';
import { HistoryService } from '../services/history.service';

export const getUserHistory: RequestHandler = async (req, res, next) => {
  try {
    console.log('📥 [getUserHistory] Incoming request');

    if (!req.user?.id) {
      console.warn('⚠️ [getUserHistory] Unauthorized access attempt');
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    console.log(`🔐 [getUserHistory] Authenticated user: ${req.user.id}`);

    const history = await HistoryService.getUserHistory(req.user.id);
    console.log(`📦 [getUserHistory] Found ${history.length} history entries`);

    const response: UserHistoryDTO = {
      firebaseUid: req.user.id,
      history,
    };

    console.log('✅ [getUserHistory] Sending response');
    res.status(200).json(response);
  } catch (error) {
    console.error('❌ [getUserHistory] Error:', error);
    next(error);
  }
};
