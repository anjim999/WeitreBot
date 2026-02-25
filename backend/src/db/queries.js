import { getDatabase } from './database.js';

// SESSION QUERIES

// Create a new session or return existing one
export function createSession(sessionId) {
    const db = getDatabase();
    const existing = db.prepare('SELECT id, created_at, updated_at FROM sessions WHERE id = ?').get(sessionId);

    if (existing) {
        return existing;
    }

    const stmt = db.prepare('INSERT INTO sessions (id) VALUES (?)');
    stmt.run(sessionId);

    return db.prepare('SELECT id, created_at, updated_at FROM sessions WHERE id = ?').get(sessionId);
}

// Update session's updated_at timestamp
export function updateSessionTimestamp(sessionId) {
    const db = getDatabase();
    const stmt = db.prepare("UPDATE sessions SET updated_at = datetime('now') WHERE id = ?");
    stmt.run(sessionId);
}

// Update session title
export function updateSessionTitle(sessionId, title) {
    const db = getDatabase();
    db.prepare('UPDATE sessions SET title = ? WHERE id = ?').run(title, sessionId);
}

// Check if session already has a title
export function hasTitle(sessionId) {
    const db = getDatabase();
    const row = db.prepare('SELECT title FROM sessions WHERE id = ?').get(sessionId);
    return !!row?.title;
}

// Get all sessions ordered by last updated
export function getAllSessions() {
    const db = getDatabase();
    const sessions = db.prepare(`
        SELECT 
            s.id,
            s.title,
            s.created_at,
            s.updated_at,
            COUNT(m.id) as message_count,
            (SELECT content FROM messages WHERE session_id = s.id AND role = 'user' ORDER BY created_at ASC LIMIT 1) as first_message
        FROM sessions s
        LEFT JOIN messages m ON s.id = m.session_id
        GROUP BY s.id
        ORDER BY s.updated_at DESC
    `).all();

    return sessions;
}

// Get a specific session by ID
export function getSessionById(sessionId) {
    const db = getDatabase();
    return db.prepare('SELECT id, title, created_at, updated_at FROM sessions WHERE id = ?').get(sessionId);
}

// Delete a session and all its messages
export function deleteSession(sessionId) {
    const db = getDatabase();
    const deleteMessages = db.prepare('DELETE FROM messages WHERE session_id = ?');
    const deleteSession = db.prepare('DELETE FROM sessions WHERE id = ?');

    const transaction = db.transaction((id) => {
        deleteMessages.run(id);
        deleteSession.run(id);
    });

    transaction(sessionId);
}

// Clear all messages for a session (keep the session)
export function clearMessages(sessionId) {
    const db = getDatabase();
    db.prepare('DELETE FROM messages WHERE session_id = ?').run(sessionId);
    updateSessionTimestamp(sessionId);
}

// --- MESSAGE QUERIES ---

// Insert a new message
export function insertMessage(sessionId, role, content, tokensUsed = 0) {
    const db = getDatabase();
    const stmt = db.prepare(
        'INSERT INTO messages (session_id, role, content, tokens_used) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(sessionId, role, content, tokensUsed);

    // Update session timestamp
    updateSessionTimestamp(sessionId);

    return {
        id: result.lastInsertRowid,
        session_id: sessionId,
        role,
        content,
        tokens_used: tokensUsed
    };
}

// Get all messages for a session in chronological order
export function getMessagesBySessionId(sessionId) {
    const db = getDatabase();
    return db.prepare(`
        SELECT id, session_id, role, content, tokens_used, created_at
        FROM messages
        WHERE session_id = ?
        ORDER BY id ASC
    `).all(sessionId);
}

// Get last N message pairs (user + assistant) for context
export function getRecentMessagePairs(sessionId, pairCount = 5) {
    const db = getDatabase();
    const limit = pairCount * 2;

    return db.prepare(`
        SELECT id, session_id, role, content, created_at
        FROM messages
        WHERE session_id = ?
        ORDER BY id DESC
        LIMIT ?
    `).all(sessionId, limit).reverse();
}

export default {
    createSession,
    updateSessionTimestamp,
    updateSessionTitle,
    hasTitle,
    getAllSessions,
    getSessionById,
    deleteSession,
    clearMessages,
    insertMessage,
    getMessagesBySessionId,
    getRecentMessagePairs
};
