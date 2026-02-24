import axiosClient from '../api/axiosClient.js';
import env from '../config/env.js';

// Send a chat message (non-streaming)
export async function sendMessage(sessionId, message) {
    const response = await axiosClient.post('/chat', { sessionId, message });
    return response.data;
}

// Send a chat message with streaming + live status updates via SSE
export async function sendMessageStream(sessionId, message) {
    const response = await fetch(`${env.API_URL}/api/chat/stream`, {
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

// Get conversation history for a session
export async function getConversation(sessionId) {
    const response = await axiosClient.get(`/conversations/${sessionId}`);
    return response.data;
}

// Get all sessions
export async function getSessions() {
    const response = await axiosClient.get('/sessions');
    return response.data;
}

// Delete a session
export async function deleteSession(sessionId) {
    const response = await axiosClient.delete(`/sessions/${sessionId}`);
    return response.data;
}

// Clear all messages from a session (keep the session)
export async function clearConversation(sessionId) {
    const response = await axiosClient.delete(`/conversations/${sessionId}`);
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
