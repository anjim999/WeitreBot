import axios from 'axios';
import env from '../config/env.js';

/**
 * Centralized Axios Client
 * All API services should import and use this client
 * instead of creating their own axios instances.
 */
const axiosClient = axios.create({
    baseURL: `${env.API_URL}/api`,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 30000
});

export default axiosClient;
