import chatService from '../services/chatService.js';

/**
 * Chat Controller - Handles HTTP request/response
 * Business logic delegated to chatService
 */

/**
 * @desc    Send a chat message and get AI response
 * @route   POST /api/chat
 */
export const sendMessage = async (req, res, next) => {
    try {
        const { sessionId, message } = req.body;

        const result = await chatService.processMessage(sessionId, message);

        res.status(200).json({
            success: true,
            reply: result.reply,
            tokensUsed: result.tokensUsed,
            docsUsed: result.docsUsed
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Send a chat message with streaming response + live status
 * @route   POST /api/chat/stream
 */
export const sendMessageStream = async (req, res) => {
    try {
        const { sessionId, message } = req.body;

        // Set up SSE headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders();

        const stream = chatService.processMessageStream(sessionId, message);

        for await (const event of stream) {
            res.write(`data: ${JSON.stringify(event)}\n\n`);
        }

        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        console.error('Stream error:', error);
        res.write(`data: ${JSON.stringify({ type: 'error', error: error.message || 'Streaming failed' })}\n\n`);
        res.end();
    }
};

/**
 * @desc    Get conversation history for a session
 * @route   GET /api/conversations/:sessionId
 */
export const getConversation = (req, res, next) => {
    try {
        const { sessionId } = req.params;

        const result = chatService.getConversation(sessionId);

        if (!result) {
            return res.status(404).json({
                success: false,
                error: 'Session not found'
            });
        }

        res.status(200).json({
            success: true,
            sessionId: result.session.id,
            messages: result.messages
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all sessions with last updated timestamp
 * @route   GET /api/sessions
 */
export const getSessions = (req, res, next) => {
    try {
        const sessions = chatService.getAllSessions();

        res.status(200).json({
            success: true,
            sessions
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a session and all its messages
 * @route   DELETE /api/sessions/:sessionId
 */
export const deleteSession = (req, res, next) => {
    try {
        const { sessionId } = req.params;

        const deleted = chatService.deleteSession(sessionId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Session not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Session deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
