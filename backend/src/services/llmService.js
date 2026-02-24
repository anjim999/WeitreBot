import { GoogleGenerativeAI } from '@google/generative-ai';
import env from '../config/env.js';

// LLM service — handles all interactions with Google Gemini
class LLMService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                temperature: 0.3,
                topP: 0.8,
                topK: 40,
                maxOutputTokens: 1024,
            }
        });
    }

    // Build the system prompt with document context and chat history
    buildPrompt(userMessage, documentContext, chatHistory = []) {
        let systemPrompt = `You are a helpful AI Support Assistant for our product/platform.

## STRICT RULES (YOU MUST FOLLOW THESE):
1. You can ONLY answer questions using the provided "Product Documentation" below.
2. If the user's question is NOT covered by the documentation, you MUST respond EXACTLY with: "Sorry, I don't have information about that."
3. Do NOT make up, guess, or hallucinate any information.
4. Do NOT provide information from your general knowledge - ONLY use the documentation provided.
5. Be concise, friendly, and professional.
6. Use markdown formatting when it improves readability (bullet points, bold for emphasis, code blocks if needed).
7. If the user greets you (hello, hi, hey), respond warmly and ask how you can help.
8. If the user thanks you, respond politely.

## Product Documentation:
`;

        if (documentContext) {
            systemPrompt += documentContext;
        } else {
            systemPrompt += '(No relevant documentation found for this query)';
        }

        systemPrompt += `

## Conversation History (for context):
`;

        if (chatHistory.length > 0) {
            for (const msg of chatHistory) {
                const role = msg.role === 'user' ? 'User' : 'Assistant';
                systemPrompt += `${role}: ${msg.content}\n`;
            }
        } else {
            systemPrompt += '(This is the start of the conversation)\n';
        }

        systemPrompt += `
## Current User Question:
${userMessage}

## Your Response:
Remember: ONLY use the Product Documentation above. If the answer is not in the docs, say "Sorry, I don't have information about that."`;

        return systemPrompt;
    }

    // Generate a regular (non-streaming) response
    async generateResponse(userMessage, documentContext, chatHistory = []) {
        try {
            const prompt = this.buildPrompt(userMessage, documentContext, chatHistory);

            const result = await this.model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            const tokensUsed = response.usageMetadata?.totalTokenCount || 0;

            return {
                reply: text,
                tokensUsed
            };
        } catch (error) {
            console.error('LLM generation error:', error);
            throw new Error('Failed to generate AI response. Please try again later.');
        }
    }

    // Generate a streaming response (yields chunks)
    async *generateStreamResponse(userMessage, documentContext, chatHistory = []) {
        try {
            const prompt = this.buildPrompt(userMessage, documentContext, chatHistory);

            const result = await this.model.generateContentStream(prompt);

            for await (const chunk of result.stream) {
                const text = chunk.text();
                if (text) {
                    yield { type: 'chunk', content: text };
                }
            }

            const response = await result.response;
            const tokensUsed = response.usageMetadata?.totalTokenCount || 0;

            yield { type: 'complete', tokensUsed };
        } catch (error) {
            console.error('LLM streaming error:', error);
            yield { type: 'error', error: 'Failed to generate AI response. Please try again later.' };
        }
    }

    // Generate a short title for a chat session
    async generateTitle(userMessage, assistantReply) {
        try {
            const prompt = `Generate a very short title (3-5 words max) for this conversation. Return ONLY the title, nothing else. No quotes, no punctuation at the end.

User: ${userMessage}
Assistant: ${assistantReply.substring(0, 200)}

Title:`;

            const result = await this.model.generateContent(prompt);
            const title = result.response.text().trim().replace(/^["']|["']$/g, '');
            return title.substring(0, 50);
        } catch (error) {
            console.error('Title generation failed:', error.message);
            // Fallback: use first few words of user message
            return userMessage.split(' ').slice(0, 5).join(' ');
        }
    }
}

const llmService = new LLMService();
export default llmService;
