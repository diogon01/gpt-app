// apps/api/src/routes/history.routes.ts
import { Router } from 'express';
import {
  getUserHistory,
  renameHistorySession,
} from '../controllers/history.controller';

const router = Router();

/**
 * GET /
 * Ex: /history/
 */
router.get('/', getUserHistory);

/**
 * PATCH /:sessionId
 * Ex: /history/:sessionId
 */
router.patch('/:sessionId', renameHistorySession);

export default router;
