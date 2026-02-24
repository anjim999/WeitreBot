import { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import StatusIndicator from './StatusIndicator';
import { Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const MessageList = ({ messages, isLoading, streamingMessage, statusStages }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingMessage, statusStages]);

    return (
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Messages */}
                {messages.map((msg, index) => (
                    <MessageItem key={msg.id || index} message={msg} />
                ))}

                {/* Status Indicators (searching, analyzing, generating) */}
                {statusStages.length > 0 && (
                    <StatusIndicator stages={statusStages} />
                )}

                {/* Streaming Message */}
                {streamingMessage && (
                    <div className="message-enter" style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        width: '100%',
                    }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', maxWidth: '70%' }}>
                            <div style={{
                                flexShrink: 0, width: '36px', height: '36px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, #764ba2, #ec4899)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Bot style={{ width: '18px', height: '18px', color: 'white' }} />
                            </div>
                            <div>
                                <div className="glass" style={{ padding: '14px 18px', borderRadius: '16px', borderTopLeftRadius: '4px', color: 'rgba(255,255,255,0.9)' }}>
                                    <div className="markdown-content">
                                        <ReactMarkdown>{streamingMessage}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Typing Indicator */}
                {isLoading && !streamingMessage && statusStages.length === 0 && (
                    <TypingIndicator />
                )}

                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default MessageList;
