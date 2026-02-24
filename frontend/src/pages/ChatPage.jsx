import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Bot, Sparkles } from 'lucide-react';

import ChatHeader from '../components/chat/ChatHeader';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import SuggestionChips from '../components/chat/SuggestionChips';
import SessionSidebar from '../components/sidebar/SessionSidebar';

import { getSessionId, createNewSession, setSessionId } from '../utils/session';
import {
    sendMessageStream,
    getConversation,
    getSessions,
    deleteSession,
    clearConversation
} from '../services/chatService';

const ChatPage = () => {
    const [sessionId, setCurrentSessionId] = useState(getSessionId());
    const [messages, setMessages] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState('');
    const [statusStages, setStatusStages] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [chatTitle, setChatTitle] = useState('');

    // Load sessions on mount
    useEffect(() => {
        loadSessions();
        loadConversation(sessionId);
    }, []);

    // Load all sessions
    const loadSessions = async () => {
        try {
            const data = await getSessions();
            setSessions(data.sessions || []);
        } catch (error) {
            // Silently fail - no sessions yet
        }
    };

    // Load conversation for a session
    const loadConversation = async (sid) => {
        try {
            const data = await getConversation(sid);
            setMessages(data.messages || []);
            // Try to get AI-generated title from sessions list
            const session = sessions.find(s => s.id === sid);
            if (session?.title) {
                setChatTitle(session.title);
            } else if (data.messages?.length > 0) {
                setChatTitle(data.messages[0].content.substring(0, 40));
            }
        } catch (error) {
            setMessages([]);
            setChatTitle('');
        }
    };

    // Handle sending a message with streaming
    const handleSend = useCallback(async (messageText) => {
        if (isLoading) return;

        // Add user message optimistically
        const userMsg = {
            id: Date.now(),
            role: 'user',
            content: messageText,
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);
        setStreamingMessage('');
        setStatusStages([]);


        try {
            const response = await sendMessageStream(sessionId, messageText);
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullMessage = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const rawData = line.slice(6);
                    if (rawData === '[DONE]') continue;

                    try {
                        const data = JSON.parse(rawData);

                        if (data.type === 'status') {
                            setStatusStages(prev => [...prev, data]);
                        } else if (data.type === 'chunk') {
                            setStatusStages([]);
                            fullMessage += data.content;
                            setStreamingMessage(fullMessage);
                        } else if (data.type === 'complete') {
                            const assistantMsg = {
                                id: Date.now() + 1,
                                role: 'assistant',
                                content: fullMessage,
                                created_at: new Date().toISOString()
                            };
                            setMessages(prev => [...prev, assistantMsg]);
                            setStreamingMessage('');
                            setStatusStages([]);
                            // Use AI-generated title if available
                            if (data.title) {
                                setChatTitle(data.title);
                            }
                        } else if (data.type === 'error') {
                            toast.error(data.error || 'Failed to get response');
                        }
                    } catch {
                        // Skip invalid JSON
                    }
                }
            }

            loadSessions();
        } catch (error) {
            toast.error(error.message || 'Failed to send message. Is the backend running?');
        } finally {
            setIsLoading(false);
            setStreamingMessage('');
            setStatusStages([]);
        }
    }, [sessionId, isLoading, chatTitle]);

    // Handle new chat
    const handleNewChat = useCallback(() => {
        const newId = createNewSession();
        setCurrentSessionId(newId);
        setMessages([]);
        setChatTitle('');
        setStreamingMessage('');
        setStatusStages([]);
        toast.success('New conversation started');
        loadSessions();

        if (window.innerWidth < 768) setSidebarOpen(false);
    }, []);

    // Handle selecting a session from sidebar
    const handleSelectSession = useCallback(async (sid) => {
        setSessionId(sid);
        setCurrentSessionId(sid);
        setStreamingMessage('');
        setStatusStages([]);
        await loadConversation(sid);

        if (window.innerWidth < 768) setSidebarOpen(false);
    }, []);

    // Handle deleting a session
    const handleDeleteSession = useCallback(async (sid) => {
        try {
            await deleteSession(sid);
            setSessions(prev => prev.filter(s => s.id !== sid));

            if (sid === sessionId) {
                const newId = createNewSession();
                setCurrentSessionId(newId);
                setMessages([]);
                setChatTitle('');
            }

            toast.success('Session deleted');
        } catch (error) {
            toast.error('Failed to delete session');
        }
    }, [sessionId]);

    // Handle suggestion chip click
    const handleSuggestion = useCallback((text) => {
        handleSend(text);
    }, [handleSend]);

    // Handle clear chat (remove messages, keep session)
    const handleClearChat = useCallback(async () => {
        try {
            await clearConversation(sessionId);
            setMessages([]);
            setChatTitle('');
            setStreamingMessage('');
            setStatusStages([]);
            toast.success('Chat cleared');
        } catch (error) {
            toast.error('Failed to clear chat');
        }
    }, [sessionId]);

    // Handle delete chat (remove session entirely)
    const handleDeleteChat = useCallback(async () => {
        try {
            await deleteSession(sessionId);
            setSessions(prev => prev.filter(s => s.id !== sessionId));

            const newId = createNewSession();
            setCurrentSessionId(newId);
            setMessages([]);
            setChatTitle('');
            setStreamingMessage('');
            setStatusStages([]);
            toast.success('Chat deleted');
            loadSessions();
        } catch (error) {
            toast.error('Failed to delete chat');
        }
    }, [sessionId]);

    return (
        <div style={{ height: '100vh', display: 'flex', overflow: 'hidden' }}>
            {/* Sidebar */}
            {sidebarOpen && (
                <>
                    <SessionSidebar
                        sessions={sessions}
                        currentSessionId={sessionId}
                        onNewChat={handleNewChat}
                        onSelectSession={handleSelectSession}
                        onDeleteSession={handleDeleteSession}
                        onClose={() => setSidebarOpen(false)}
                    />
                    {/* Mobile overlay */}
                    <div
                        className="sidebar-overlay"
                        onClick={() => setSidebarOpen(false)}
                        style={{ display: 'none' }}
                    />
                </>
            )}

            {/* Main Chat Area */}
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minWidth: 0,
                marginLeft: sidebarOpen ? '280px' : '0',
                transition: 'margin-left 0.3s ease',
            }}>
                <ChatHeader
                    title={chatTitle}
                    sidebarOpen={sidebarOpen}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    onClearChat={handleClearChat}
                    onDeleteChat={handleDeleteChat}
                    hasMessages={messages.length > 0}
                />

                {/* Empty State or Messages */}
                {messages.length === 0 && !isLoading ? (
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '32px 20px',
                    }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '20px',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '24px',
                            boxShadow: '0 8px 30px rgba(102, 126, 234, 0.25)',
                        }}>
                            <Bot style={{ width: '40px', height: '40px', color: 'white' }} />
                        </div>
                        <h2 className="gradient-text" style={{
                            fontSize: '26px', fontWeight: 700, marginBottom: '8px',
                            display: 'flex', alignItems: 'center', gap: '10px',
                        }}>
                            How can I help you today?
                            <Sparkles style={{ width: '22px', height: '22px', color: '#818cf8' }} />
                        </h2>
                        <p style={{
                            color: 'rgba(255,255,255,0.45)', textAlign: 'center',
                            maxWidth: '480px', marginBottom: '32px',
                            fontSize: '14px', lineHeight: '1.6',
                        }}>
                            I'm your AI support assistant. I can answer questions about our product based on our documentation.
                        </p>
                        <SuggestionChips onSelect={handleSuggestion} />
                    </div>
                ) : (
                    <MessageList
                        messages={messages}
                        isLoading={isLoading}
                        streamingMessage={streamingMessage}
                        statusStages={statusStages}
                    />
                )}

                <MessageInput onSend={handleSend} isLoading={isLoading} />
            </main>
        </div>
    );
};

export default ChatPage;
