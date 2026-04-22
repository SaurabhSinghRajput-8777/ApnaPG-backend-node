import { Router } from 'express';
import { handleAIChat } from '../controllers/aiController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * @route POST /api/ai/chat
 * @desc Interaction with Gemini AI Assistant
 * @access Private
 */
router.post('/chat', authMiddleware, handleAIChat);

export default router;
