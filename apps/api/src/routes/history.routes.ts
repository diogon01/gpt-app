// apps/api/src/routes/history.routes.ts

import { Router } from 'express';
import {
  deleteHistorySession,
  getUserHistory,
  renameHistorySession,
  searchUserHistory,
} from '../controllers/history.controller';

const router = Router();

/**
 * @route GET /history
 * @desc Returns the authenticated user's history list
 * @access Private
 */
router.get('/', getUserHistory);

/**
 * @route GET /history/search
 * @desc Searches history sessions by message content
 * @access Private
 */
router.get('/search', searchUserHistory);

/**
 * @route PATCH /history/:sessionId
 * @desc Renames a specific session for the authenticated user
 * @access Private
 */
router.patch('/:sessionId', renameHistorySession);

/**
 * @route DELETE /history/:sessionId
 * @desc Deletes a specific session for the authenticated user
 * @access Private
 */
router.delete('/:sessionId', deleteHistorySession);

export default router;
