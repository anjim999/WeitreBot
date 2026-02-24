import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', '..', 'support_assistant.db');

let db;

/**
 * Initialize SQLite database and create tables if they don't exist
 */
export function initializeDatabase() {
    db = new Database(DB_PATH);

    // Enable WAL mode for better concurrent performance
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    // Create sessions table
    db.exec(`
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            created_at DATETIME DEFAULT (datetime('now')),
            updated_at DATETIME DEFAULT (datetime('now'))
        )
    `);

    // Create messages table
    db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
            content TEXT NOT NULL,
            tokens_used INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT (datetime('now')),
            FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
        )
    `);

    // Create indexes for performance
    db.exec(`
        CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
        CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
        CREATE INDEX IF NOT EXISTS idx_sessions_updated_at ON sessions(updated_at);
    `);

    console.log('✅ SQLite database initialized');
    return db;
}

/**
 * Get the database instance
 */
export function getDatabase() {
    if (!db) {
        return initializeDatabase();
    }
    return db;
}

/**
 * Close the database connection
 */
export function closeDatabase() {
    if (db) {
        db.close();
        db = null;
        console.log('🔒 SQLite database closed');
    }
}

export default { initializeDatabase, getDatabase, closeDatabase };
