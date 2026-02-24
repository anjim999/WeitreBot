import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import env from './config/env.js';
import { initializeDatabase } from './db/database.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import chatRoutes from './routes/chat.routes.js';

// Initialize Express
const app = express();

// Initialize SQLite database
initializeDatabase();

// SECURITY MIDDLEWARE 

app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS — allow local dev and production URLs
const allowedOrigins = [
    env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.some(allowed => origin.startsWith(allowed) || origin.includes('vercel.app'))) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// Body parser
app.use(express.json({ limit: '1mb' }));

// General rate limiting
app.use('/api', apiLimiter);

// ROUTES

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime())
    });
});

// API routes
app.use('/api', chatRoutes);

// ERROR HANDLING

app.use('*', notFoundHandler);
app.use(errorHandler);

// START SERVER

const PORT = env.PORT;

app.listen(PORT, () => {
    console.log(`
   🚀 AI Support Assistant Backend       
   Port:        ${PORT}                       
   Environment: ${env.NODE_ENV.padEnd(23)}
 API URL:     http://localhost:${PORT}      
    `);
});

export default app;
