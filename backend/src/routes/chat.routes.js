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

// --- CHAT ENDPOINTS ---

// POST /api/chat — send message (regular response)
router.post('/chat', chatLimiter, validateChatRequest, sendMessage);

// POST /api/chat/stream — send message (streaming + live status)
router.post('/chat/stream', chatLimiter, validateChatRequest, sendMessageStream);

// --- CONVERSATION ENDPOINTS ---

// GET /api/conversations/:sessionId — get conversation history
router.get('/conversations/:sessionId', validateSessionId, getConversation);

// DELETE /api/conversations/:sessionId — clear all messages (keep session)
router.delete('/conversations/:sessionId', validateSessionId, clearConversation);

// --- SESSION ENDPOINTS ---

// GET /api/sessions — list all sessions
router.get('/sessions', getSessions);

// DELETE /api/sessions/:sessionId — delete a session
router.delete('/sessions/:sessionId', validateSessionId, deleteSession);

export default router;
