import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { formatMessageTime } from '../../utils/session';

const MessageItem = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div
            className="message-enter"
            style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                width: '100%',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    flexDirection: isUser ? 'row-reverse' : 'row',
                    maxWidth: '70%',
                }}
            >
                {/* Avatar */}
                <div
                    style={{
                        flexShrink: 0,
                        width: '36px',
                        height: '36px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isUser
                            ? '#667eea'
                            : 'linear-gradient(135deg, #764ba2, #ec4899)',
                    }}
                >
                    {isUser ? (
                        <User style={{ width: '18px', height: '18px', color: 'white' }} />
                    ) : (
                        <Bot style={{ width: '18px', height: '18px', color: 'white' }} />
                    )}
                </div>

                {/* Message Bubble + Timestamp */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                }}>
                    <div
                        className={isUser ? '' : 'glass'}
                        style={{
                            padding: '14px 18px',
                            borderRadius: '16px',
                            borderTopRightRadius: isUser ? '4px' : '16px',
                            borderTopLeftRadius: isUser ? '16px' : '4px',
                            background: isUser ? '#667eea' : undefined,
                            color: isUser ? 'white' : 'rgba(255,255,255,0.9)',
                        }}
                    >
                        {isUser ? (
                            <p style={{ fontSize: '14.5px', lineHeight: '1.6', margin: 0 }}>{message.content}</p>
                        ) : (
                            <div className="markdown-content">
                                <ReactMarkdown>{message.content}</ReactMarkdown>
                            </div>
                        )}
                    </div>

                    {/* Timestamp */}
                    {message.created_at && (
                        <span style={{
                            fontSize: '10px',
                            color: 'rgba(255,255,255,0.2)',
                            marginTop: '6px',
                            paddingLeft: '4px',
                            paddingRight: '4px',
                        }}>
                            {formatMessageTime(message.created_at)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageItem;
