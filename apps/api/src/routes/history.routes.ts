import express, { Router } from 'express';
import {
  createUserHistorySession,
  deleteHistorySession,
  getUserHistory,
  getUserHistorySessionById,
  renameHistorySession,
  searchUserHistory,
} from '../controllers/history.controller';

const router: Router = express.Router();

/**
 * @route GET /history
 * @desc Returns the authenticated user's history list
 * @access Private
 */
router.get('/', getUserHistory);

/**
 * @route POST /history
 * @desc Creates a new user session with optional initial message
 * @access Private
 */
router.post('/', createUserHistorySession);

/**
 * @route GET /history/search
 * @desc Searches history sessions by message content
 * @access Private
 */
router.get('/search', searchUserHistory);

/**
 * @route GET /history/:sessionId
 * @desc Returns a specific session for the authenticated user
 * @access Private
 */
router.get('/:sessionId', getUserHistorySessionById);

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
