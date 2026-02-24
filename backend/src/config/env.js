import 'dotenv/config';

const env = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 20,
};

// Validate required env vars
const requiredVars = ['GEMINI_API_KEY'];
for (const varName of requiredVars) {
    if (!env[varName]) {
        console.error(`❌ Missing required environment variable: ${varName}`);
        console.error(`   Please set it in your .env file`);
        process.exit(1);
    }
}

export default env;
