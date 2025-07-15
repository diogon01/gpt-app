// packages/server/src/controllers/history.controller.ts
import { HistoryRenameRequestDTO } from '@42robotics/domain/src';
import { mapUserHistoryToDTO } from '@42robotics/domain/src/mappers/user-history.mapper';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { HistoryService } from '../services/history.service';

/**
 * GET /history
 *
 * Retrieves the authenticated user's conversation history and returns it
 * with the expected `sessions` key used by the frontend.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction callback
 * @returns void
 */
export const getUserHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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

    res.status(200).json(response);
    console.log('✅ [getUserHistory] Response sent');
  } catch (error) {
    console.error('❌ [getUserHistory] Error:', error);
    next(error);
  }
};

/**
 * PATCH /history/:sessionId
 *
 * Renames a user's specific history session, identified by the session's MongoDB ObjectId.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction callback
 * @returns void
 */
export const renameHistorySession: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { sessionId } = req.params;
    const body = req.body as HistoryRenameRequestDTO;

    if (!body?.title?.trim()) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    // ✅ Trata sessionId como string (_id)
    await HistoryService.renameSession(req.user.id, sessionId, {
      title: body.title.trim(),
    });

    res.status(204).send();
  } catch (error) {
    if ((error as Error).message === 'SESSION_NOT_FOUND') {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    next(error);
  }
};
