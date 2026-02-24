// Validate chat request body
export const validateChatRequest = (req, res, next) => {
    const { sessionId, message } = req.body;

    if (!sessionId || typeof sessionId !== 'string' || sessionId.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Missing or invalid "sessionId". Must be a non-empty string.'
        });
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Missing or invalid "message". Must be a non-empty string.'
        });
    }

    if (message.length > 5000) {
        return res.status(400).json({
            success: false,
            error: 'Message too long. Maximum length is 5000 characters.'
        });
    }

    // Sanitize inputs
    req.body.sessionId = sessionId.trim();
    req.body.message = message.trim();

    next();
};

// Validate sessionId param
export const validateSessionId = (req, res, next) => {
    const { sessionId } = req.params;

    if (!sessionId || typeof sessionId !== 'string' || sessionId.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Missing or invalid sessionId parameter.'
        });
    }

    next();
};
