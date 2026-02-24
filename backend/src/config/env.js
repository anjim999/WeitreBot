import 'dotenv/config';

const env = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    CLIENT_URL: process.env.CLIENT_URL,
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS),
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
