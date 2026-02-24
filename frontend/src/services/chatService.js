import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 30000
});

/**
 * Send a chat message (non-streaming)
 */
export async function sendMessage(sessionId, message) {
    const response = await api.post('/chat', { sessionId, message });
    return response.data;
}

/**
 * Send a chat message with streaming + live status updates
 * Returns a ReadableStream for SSE processing
 */
export async function sendMessageStream(sessionId, message) {
    const response = await fetch(`${API_URL}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
    }

    return response;
}

/**
 * Get conversation history for a session
 */
export async function getConversation(sessionId) {
    const response = await api.get(`/conversations/${sessionId}`);
    return response.data;
}

/**
 * Get all sessions
 */
export async function getSessions() {
    const response = await api.get('/sessions');
    return response.data;
}

/**
 * Delete a session
 */
export async function deleteSession(sessionId) {
    const response = await api.delete(`/sessions/${sessionId}`);
    return response.data;
}

/**
 * Clear all messages from a session (keep the session)
 */
export async function clearConversation(sessionId) {
    const response = await api.delete(`/conversations/${sessionId}`);
    return response.data;
}

export default {
    sendMessage,
    sendMessageStream,
    getConversation,
    getSessions,
    deleteSession,
    clearConversation
};
