// Centralized environment configuration
const env = {
    API_URL: import.meta.env.VITE_API_URL,
    MODE: import.meta.env.MODE,
    IS_PROD: import.meta.env.PROD,
};

export default env;
