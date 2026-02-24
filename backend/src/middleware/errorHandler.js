// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err.message);

    // SQLite errors
    if (err.code === 'SQLITE_ERROR' || err.code === 'SQLITE_CONSTRAINT') {
        return res.status(500).json({
            success: false,
            error: 'Database error occurred. Please try again.',
            ...(process.env.NODE_ENV === 'development' && { details: err.message })
        });
    }

    // Gemini API errors
    if (err.message?.includes('API key') || err.message?.includes('quota')) {
        return res.status(503).json({
            success: false,
            error: 'AI service is temporarily unavailable. Please try again later.'
        });
    }

    // Default error
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// 404 handler
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: `Route not found: ${req.method} ${req.originalUrl}`
    });
};
