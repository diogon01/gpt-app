// apps/api/src/controllers/history.controller.ts

import { HistoryRenameRequestDTO } from '@42robotics/domain/src';
import { HistorySearchResponseDTO } from '@42robotics/domain/src/dtos/response/history-search-response.dto';
import { mapUserHistoryToDTO } from '@42robotics/domain/src/mappers/user-history.mapper';
import { RequestHandler } from 'express';
import { HistoryService } from '../services/history.service';

/**
 * Retrieves the authenticated user's full conversation history.
 *
 * @route GET /history
 * @access Private
 * @param req - Express request object containing the authenticated user
 * @param res - Express response object used to send the response
 * @param next - Express next middleware function for error handling
 * @returns Sends a 200 response with the mapped history or 401 if unauthorized
 */
export const getUserHistory: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const rawHistory = await HistoryService.getUserHistory(req.user.id);

    const response = mapUserHistoryToDTO({
      userId: req.user.id,
      sessions: rawHistory,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a specific history session by ID for the authenticated user.
 *
 * @route GET /history/:sessionId
 * @access Private
 * @param req - Express request object containing sessionId and authenticated user
 * @param res - Express response object used to return the session data
 * @param next - Express next middleware function for error handling
 * @returns Sends a 200 response with the session data or appropriate error
 */
export const getUserHistorySessionById: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { sessionId } = req.params;

    const session = await HistoryService.getSessionById(req.user.id, sessionId);

    res.status(200).json(session);
  } catch (error) {
    if ((error as Error).message === 'SESSION_NOT_FOUND') {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    next(error);
  }
};

/**
 * Updates the title of a specific history session by session ID.
 *
 * @route PATCH /history/:sessionId
 * @access Private
 * @param req - Express request object containing sessionId and new title
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 * @returns Sends a 204 No Content response on success, or appropriate error status
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

/**
 * Deletes a specific history session by session ID.
 *
 * @route DELETE /history/:sessionId
 * @access Private
 * @param req - Express request object with sessionId and authenticated user
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 * @returns Sends a 204 No Content response on success, or 404 if not found
 */
export const deleteHistorySession: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await HistoryService.deleteSession(req.user.id, req.params.sessionId);

    res.status(204).send();
  } catch (error) {
    if ((error as Error).message === 'SESSION_NOT_FOUND') {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    next(error);
  }
};

/**
 * Searches user history messages for a matching query string.
 *
 * @route GET /history/search?q={query}
 * @access Private
 * @param req - Express request with query parameter `q`
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 * @returns Sends a 200 response with an array of matches or appropriate error
 */
export const searchUserHistory: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const query = (req.query.q as string)?.trim();
    if (!query || query.length < 2) {
      res.status(400).json({ error: 'Query param "q" must be at least 2 characters' });
      return;
    }

    const matches = await HistoryService.searchSessions(req.user.id, query);

    const response: HistorySearchResponseDTO = {
      matches,
      total: matches.length,
      query,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
