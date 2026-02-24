import chatService from '../services/chatService.js';

// Send a chat message and get AI response — POST /api/chat
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

// Send a chat message with streaming response — POST /api/chat/stream
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

// Get conversation history — GET /api/conversations/:sessionId
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

// Get all sessions — GET /api/sessions
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

// Delete a session and all its messages — DELETE /api/sessions/:sessionId
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

// Clear all messages from a session — DELETE /api/conversations/:sessionId
export const clearConversation = (req, res, next) => {
    try {
        const { sessionId } = req.params;

        const cleared = chatService.clearConversation(sessionId);

        if (!cleared) {
            return res.status(404).json({
                success: false,
                error: 'Session not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Conversation cleared successfully'
        });
    } catch (error) {
        next(error);
    }
};
