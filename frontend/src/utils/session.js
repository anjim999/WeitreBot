import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'support_session_id';

/**
 * Get the current session ID from localStorage
 * Creates a new one if it doesn't exist
 */
export function getSessionId() {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
        sessionId = uuidv4();
        localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
}

/**
 * Generate a new session ID (for "New Chat" button)
 */
export function createNewSession() {
    const sessionId = uuidv4();
    localStorage.setItem(SESSION_KEY, sessionId);
    return sessionId;
}

/**
 * Set a specific session ID (for loading old sessions)
 */
export function setSessionId(sessionId) {
    localStorage.setItem(SESSION_KEY, sessionId);
}

/**
 * Format a timestamp to relative time
 */
export function formatTimestamp(dateString) {
    // SQLite datetime('now') is UTC but has no 'Z' suffix — append it
    const utcString = dateString?.endsWith('Z') ? dateString : dateString + 'Z';
    const date = new Date(utcString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Format timestamp for message display
 */
export function formatMessageTime(dateString) {
    const utcString = dateString?.endsWith('Z') ? dateString : dateString + 'Z';
    const date = new Date(utcString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}
