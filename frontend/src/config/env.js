/**
 * Centralized Environment Configuration
 * All environment variables are read here and exported.
 * No other file should read import.meta.env directly.
 */

const env = {
    // Backend API URL (set via VITE_API_URL in .env)
    API_URL: import.meta.env.VITE_API_URL,

    // Current environment mode
    MODE: import.meta.env.MODE,

    // Is production?
    IS_PROD: import.meta.env.PROD,
};

export default env;
