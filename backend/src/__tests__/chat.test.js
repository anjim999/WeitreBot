import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';

// Mini test server setup without requiring Gemini API key
import express from 'express';
import { initializeDatabase, closeDatabase, getDatabase } from '../db/database.js';
import * as queries from '../db/queries.js';

let app;

function createTestApp() {
    const testApp = express();
    testApp.use(express.json());

    // GET /api/sessions
    testApp.get('/api/sessions', (req, res) => {
        try {
            const sessions = queries.getAllSessions();
            res.json({ success: true, sessions });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // GET /api/conversations/:sessionId
    testApp.get('/api/conversations/:sessionId', (req, res) => {
        try {
            const session = queries.getSessionById(req.params.sessionId);
            if (!session) {
                return res.status(404).json({ success: false, error: 'Session not found' });
            }
            const messages = queries.getMessagesBySessionId(req.params.sessionId);
            res.json({ success: true, sessionId: session.id, messages });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // POST /api/chat (mock - no LLM)
    testApp.post('/api/chat', (req, res) => {
        const { sessionId, message } = req.body;

        if (!sessionId || !message) {
            return res.status(400).json({
                success: false,
                error: 'Missing sessionId or message'
            });
        }

        queries.createSession(sessionId);
        queries.insertMessage(sessionId, 'user', message);
        queries.insertMessage(sessionId, 'assistant', 'Test response', 10);

        res.json({
            success: true,
            reply: 'Test response',
            tokensUsed: 10
        });
    });

    // DELETE /api/sessions/:sessionId
    testApp.delete('/api/sessions/:sessionId', (req, res) => {
        const session = queries.getSessionById(req.params.sessionId);
        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }
        queries.deleteSession(req.params.sessionId);
        res.json({ success: true, message: 'Session deleted' });
    });

    return testApp;
}

describe('AI Support Assistant API', () => {
    beforeAll(() => {
        // Use in-memory-like approach: init fresh DB
        initializeDatabase();
        app = createTestApp();
    });

    afterAll(() => {
        closeDatabase();
    });

    // ==========================================
    // SESSION ENDPOINTS
    // ==========================================
    describe('GET /api/sessions', () => {
        test('should return empty sessions list initially', async () => {
            const res = await request(app).get('/api/sessions');
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.sessions)).toBe(true);
        });
    });

    // ==========================================
    // CHAT ENDPOINT
    // ==========================================
    describe('POST /api/chat', () => {
        test('should return 400 if sessionId is missing', async () => {
            const res = await request(app)
                .post('/api/chat')
                .send({ message: 'Hello' });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test('should return 400 if message is missing', async () => {
            const res = await request(app)
                .post('/api/chat')
                .send({ sessionId: 'test-session-1' });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test('should process a valid chat message', async () => {
            const res = await request(app)
                .post('/api/chat')
                .send({
                    sessionId: 'test-session-1',
                    message: 'How do I reset my password?'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.reply).toBeDefined();
            expect(typeof res.body.tokensUsed).toBe('number');
        });

        test('should create session automatically', async () => {
            const res = await request(app).get('/api/sessions');
            expect(res.body.sessions.length).toBeGreaterThan(0);
            expect(res.body.sessions.some(s => s.id === 'test-session-1')).toBe(true);
        });
    });

    // ==========================================
    // CONVERSATION ENDPOINT
    // ==========================================
    describe('GET /api/conversations/:sessionId', () => {
        test('should return 404 for non-existent session', async () => {
            const res = await request(app).get('/api/conversations/non-existent');
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });

        test('should return messages for existing session', async () => {
            const res = await request(app).get('/api/conversations/test-session-1');
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.sessionId).toBe('test-session-1');
            expect(Array.isArray(res.body.messages)).toBe(true);
            expect(res.body.messages.length).toBe(2); // user + assistant
        });

        test('should return messages in chronological order', async () => {
            const res = await request(app).get('/api/conversations/test-session-1');
            const messages = res.body.messages;
            expect(messages[0].role).toBe('user');
            expect(messages[1].role).toBe('assistant');
        });
    });

    // ==========================================
    // DELETE SESSION
    // ==========================================
    describe('DELETE /api/sessions/:sessionId', () => {
        test('should return 404 for non-existent session', async () => {
            const res = await request(app).delete('/api/sessions/non-existent');
            expect(res.status).toBe(404);
        });

        test('should delete an existing session', async () => {
            // First create a session to delete
            await request(app)
                .post('/api/chat')
                .send({ sessionId: 'delete-me', message: 'Hello' });

            const res = await request(app).delete('/api/sessions/delete-me');
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);

            // Verify it's gone
            const check = await request(app).get('/api/conversations/delete-me');
            expect(check.status).toBe(404);
        });
    });

    // ==========================================
    // DATABASE QUERIES
    // ==========================================
    describe('Database Queries', () => {
        test('should store and retrieve message pairs', async () => {
            const sid = 'context-test';
            queries.createSession(sid);
            queries.insertMessage(sid, 'user', 'Question 1');
            queries.insertMessage(sid, 'assistant', 'Answer 1');
            queries.insertMessage(sid, 'user', 'Question 2');
            queries.insertMessage(sid, 'assistant', 'Answer 2');

            const pairs = queries.getRecentMessagePairs(sid, 5);
            expect(pairs.length).toBe(4);
            expect(pairs[0].role).toBe('user');
            expect(pairs[0].content).toBe('Question 1');
        });

        test('should limit to last N message pairs', async () => {
            const sid = 'limit-test';
            queries.createSession(sid);

            for (let i = 1; i <= 10; i++) {
                queries.insertMessage(sid, 'user', `Q${i}`);
                queries.insertMessage(sid, 'assistant', `A${i}`);
            }

            const pairs = queries.getRecentMessagePairs(sid, 2);
            expect(pairs.length).toBe(4); // 2 pairs = 4 messages
            expect(pairs[0].content).toBe('Q9');
        });
    });
});
