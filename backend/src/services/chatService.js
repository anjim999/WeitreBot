import * as queries from '../db/queries.js';
import ragService from './ragService.js';
import llmService from './llmService.js';

/**
 * Chat Service - Orchestrates the chat flow
 * Handles session management, RAG retrieval, and LLM calls
 */
class ChatService {
    /**
     * Process a chat message (non-streaming)
     * 1. Ensure session exists
     * 2. Store user message in DB
     * 3. Find relevant docs via RAG
     * 4. Get recent chat history from DB (last 5 pairs)
     * 5. Generate AI response
     * 6. Store AI response in DB
     */
    async processMessage(sessionId, userMessage) {
        // Step 1: Ensure session exists
        queries.createSession(sessionId);

        // Step 2: Store user message
        queries.insertMessage(sessionId, 'user', userMessage);

        // Step 3: Find relevant docs via RAG (similarity search)
        const { context, docsUsed, hasRelevantDocs } = ragService.buildContext(userMessage);

        // Step 4: Get last 5 message pairs from SQLite for context
        const recentHistory = queries.getRecentMessagePairs(sessionId, 5);

        // Step 5: Generate AI response
        const { reply, tokensUsed } = await llmService.generateResponse(
            userMessage,
            context,
            recentHistory
        );

        // Step 6: Store AI response in DB
        queries.insertMessage(sessionId, 'assistant', reply, tokensUsed);

        return {
            reply,
            tokensUsed,
            docsUsed,
            hasRelevantDocs
        };
    }

    /**
     * Process a chat message with streaming + live status updates
     * Yields SSE events for each stage:
     *   - status: searching, analyzing, generating
     *   - chunk: streaming text
     *   - complete: final result
     */
    async *processMessageStream(sessionId, userMessage) {
        // Step 1: Session
        yield { type: 'status', stage: 'session', message: '🔄 Initializing session...' };
        queries.createSession(sessionId);
        queries.insertMessage(sessionId, 'user', userMessage);

        // Step 2: RAG Search
        yield { type: 'status', stage: 'searching', message: '🔍 Searching documentation...' };
        await this.delay(400); // Small delay for visual effect

        const { context, docsUsed, hasRelevantDocs } = ragService.buildContext(userMessage);
        yield {
            type: 'status',
            stage: 'docs_found',
            message: hasRelevantDocs
                ? `📄 Found ${docsUsed.length} relevant document(s)`
                : '📄 No specific documentation match found'
        };

        // Step 3: Get chat history
        yield { type: 'status', stage: 'analyzing', message: '🧠 Analyzing conversation context...' };
        await this.delay(300);
        const recentHistory = queries.getRecentMessagePairs(sessionId, 5);

        // Step 4: Generate response
        yield { type: 'status', stage: 'generating', message: '✍️ Generating response...' };
        await this.delay(200);

        let fullResponse = '';
        let tokensUsed = 0;

        const stream = llmService.generateStreamResponse(
            userMessage,
            context,
            recentHistory
        );

        for await (const event of stream) {
            if (event.type === 'chunk') {
                fullResponse += event.content;
                yield { type: 'chunk', content: event.content };
            } else if (event.type === 'complete') {
                tokensUsed = event.tokensUsed;
            } else if (event.type === 'error') {
                yield { type: 'error', error: event.error };
                return;
            }
        }

        // Step 5: Store response
        queries.insertMessage(sessionId, 'assistant', fullResponse, tokensUsed);

        yield {
            type: 'complete',
            tokensUsed,
            docsUsed,
            hasRelevantDocs
        };
    }

    /**
     * Get all messages for a session
     */
    getConversation(sessionId) {
        const session = queries.getSessionById(sessionId);
        if (!session) {
            return null;
        }

        const messages = queries.getMessagesBySessionId(sessionId);
        return {
            session,
            messages
        };
    }

    /**
     * Get all sessions
     */
    getAllSessions() {
        return queries.getAllSessions();
    }

    /**
     * Delete a session
     */
    deleteSession(sessionId) {
        const session = queries.getSessionById(sessionId);
        if (!session) {
            return false;
        }
        queries.deleteSession(sessionId);
        return true;
    }

    /**
     * Small delay helper for visual status updates
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const chatService = new ChatService();
export default chatService;
