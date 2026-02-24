import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

/**
 * General API rate limiter - per IP
 */
export const apiLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    message: {
        success: false,
        error: 'Too many requests. Please slow down and try again later.',
        retryAfter: Math.ceil(env.RATE_LIMIT_WINDOW_MS / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.ip || req.headers['x-forwarded-for'] || 'unknown';
    }
});

/**
 * Stricter rate limiter for chat endpoint
 */
export const chatLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 15, // 15 messages per minute
    message: {
        success: false,
        error: 'Too many messages. Please wait a moment before sending another message.',
        retryAfter: 60
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.ip || req.headers['x-forwarded-for'] || 'unknown';
    }
});
