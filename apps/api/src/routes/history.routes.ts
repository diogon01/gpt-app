import { Router } from 'express';
import {
  getUserHistory,
  renameHistorySession,
} from '../controllers/history.controller';

const router = Router();

/**
 * GET /history
 * Returns the authenticated user's history
 */
router.get('/history', getUserHistory);

/**
 * PATCH /history/:sessionId
 * Renames a specific session for the authenticated user
 */
router.patch('/history/:sessionId', renameHistorySession);

export default router;
