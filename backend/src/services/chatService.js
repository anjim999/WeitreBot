import * as queries from '../db/queries.js';
import ragService from './ragService.js';
import llmService from './llmService.js';

// Chat service — orchestrates session management, RAG retrieval, and LLM calls
class ChatService {
    // Process a chat message (non-streaming)
    async processMessage(sessionId, userMessage) {
        // Ensure session exists
        queries.createSession(sessionId);

        // Store user message
        queries.insertMessage(sessionId, 'user', userMessage);

        // Find relevant docs via RAG similarity search
        const { context, docsUsed, hasRelevantDocs } = ragService.buildContext(userMessage);

        // Get last 5 message pairs from DB for context
        const recentHistory = queries.getRecentMessagePairs(sessionId, 5);

        // Generate AI response
        const { reply, tokensUsed } = await llmService.generateResponse(
            userMessage,
            context,
            recentHistory
        );

        // Store AI response in DB
        queries.insertMessage(sessionId, 'assistant', reply, tokensUsed);

        // Generate title for session (first message only)
        let title = null;
        if (!queries.hasTitle(sessionId)) {
            title = await llmService.generateTitle(userMessage, reply);
            queries.updateSessionTitle(sessionId, title);
        }

        return {
            reply,
            tokensUsed,
            docsUsed,
            hasRelevantDocs,
            title
        };
    }

    // Process a chat message with streaming and live status updates
    async *processMessageStream(sessionId, userMessage) {
        // Initialize session
        yield { type: 'status', stage: 'session', message: 'Initializing session...' };
        queries.createSession(sessionId);
        queries.insertMessage(sessionId, 'user', userMessage);

        // RAG search
        yield { type: 'status', stage: 'searching', message: 'Searching documentation...' };
        await this.delay(400);

        const { context, docsUsed, hasRelevantDocs } = ragService.buildContext(userMessage);
        yield {
            type: 'status',
            stage: 'docs_found',
            message: hasRelevantDocs
                ? `Found ${docsUsed.length} relevant document(s)`
                : 'No specific documentation match found'
        };

        // Get chat history for context
        yield { type: 'status', stage: 'analyzing', message: 'Analyzing conversation context...' };
        await this.delay(300);
        const recentHistory = queries.getRecentMessagePairs(sessionId, 5);

        // Generate streaming response
        yield { type: 'status', stage: 'generating', message: 'Generating response...' };
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

        // Store response in DB
        queries.insertMessage(sessionId, 'assistant', fullResponse, tokensUsed);

        // Generate title (first message only)
        let title = null;
        if (!queries.hasTitle(sessionId)) {
            try {
                title = await llmService.generateTitle(userMessage, fullResponse);
                queries.updateSessionTitle(sessionId, title);
            } catch (e) {
                // Non-critical — ignore title generation failure
            }
        }

        yield {
            type: 'complete',
            tokensUsed,
            docsUsed,
            hasRelevantDocs,
            title
        };
    }

    // Get all messages for a session
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

    // Get all sessions
    getAllSessions() {
        return queries.getAllSessions();
    }

    // Delete a session and its messages
    deleteSession(sessionId) {
        const session = queries.getSessionById(sessionId);
        if (!session) {
            return false;
        }
        queries.deleteSession(sessionId);
        return true;
    }

    // Clear all messages from a session (keep the session)
    clearConversation(sessionId) {
        const session = queries.getSessionById(sessionId);
        if (!session) {
            return false;
        }
        queries.clearMessages(sessionId);
        return true;
    }

    // Small delay helper for visual status updates
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const chatService = new ChatService();
export default chatService;
