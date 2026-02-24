import axios from 'axios';
import env from '../config/env.js';

// Centralized axios client — all services use this instance
const axiosClient = axios.create({
    baseURL: `${env.API_URL}/api`,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 30000
});

export default axiosClient;
