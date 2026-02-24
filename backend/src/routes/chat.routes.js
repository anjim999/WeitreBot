import express from 'express';
import {
    sendMessage,
    sendMessageStream,
    getConversation,
    clearConversation,
    getSessions,
    deleteSession
} from '../controllers/chatController.js';
import { chatLimiter } from '../middleware/rateLimiter.js';
import { validateChatRequest, validateSessionId } from '../middleware/validator.js';

const router = express.Router();

// ==========================================
// CHAT ENDPOINTS
// ==========================================

// POST /api/chat - Send message (regular response)
router.post('/chat', chatLimiter, validateChatRequest, sendMessage);

// POST /api/chat/stream - Send message (streaming + live status)
router.post('/chat/stream', chatLimiter, validateChatRequest, sendMessageStream);

// ==========================================
// CONVERSATION ENDPOINTS
// ==========================================

// GET /api/conversations/:sessionId - Get conversation history
router.get('/conversations/:sessionId', validateSessionId, getConversation);

// DELETE /api/conversations/:sessionId - Clear all messages (keep session)
router.delete('/conversations/:sessionId', validateSessionId, clearConversation);

// ==========================================
// SESSION ENDPOINTS
// ==========================================

// GET /api/sessions - List all sessions
router.get('/sessions', getSessions);

// DELETE /api/sessions/:sessionId - Delete a session
router.delete('/sessions/:sessionId', validateSessionId, deleteSession);

export default router;
