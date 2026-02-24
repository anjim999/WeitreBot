import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, Bot, Sparkles, Eraser, Trash2 } from 'lucide-react';

const ChatHeader = ({ title, sidebarOpen, onToggleSidebar, onClearChat, onDeleteChat, hasMessages }) => {
    const [showConfirm, setShowConfirm] = useState(null); // 'clear' | 'delete' | null

    const handleConfirmAction = () => {
        if (showConfirm === 'clear') {
            onClearChat();
        } else if (showConfirm === 'delete') {
            onDeleteChat();
        }
        setShowConfirm(null);
    };

    return (
        <header className="glass-dark" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            position: 'relative',
        }}>
            <button
                onClick={onToggleSidebar}
                style={{
                    padding: '8px',
                    borderRadius: '10px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                aria-label="Toggle sidebar"
            >
                {sidebarOpen ? (
                    <X style={{ width: '20px', height: '20px', color: 'rgba(255,255,255,0.7)' }} />
                ) : (
                    <Menu style={{ width: '20px', height: '20px', color: 'rgba(255,255,255,0.7)' }} />
                )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <div style={{
                    width: '38px', height: '38px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Bot style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                    <h1 style={{
                        fontSize: '15px', fontWeight: 600, color: 'white',
                        display: 'flex', alignItems: 'center', gap: '8px', margin: 0,
                    }}>
                        {title || 'AI Support Assistant'}
                        <Sparkles style={{ width: '14px', height: '14px', color: '#818cf8' }} />
                    </h1>
                </div>
            </div>

            {/* Action Buttons */}
            {hasMessages && (
                <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                        onClick={() => setShowConfirm('clear')}
                        title="Clear chat messages"
                        id="clear-chat-button"
                        style={{
                            padding: '8px 12px',
                            borderRadius: '10px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '12px',
                            fontWeight: 500,
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(251, 191, 36, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.3)';
                            e.currentTarget.style.color = '#fbbf24';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                            e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                        }}
                    >
                        <Eraser style={{ width: '14px', height: '14px' }} />
                        Clear
                    </button>
                    <button
                        onClick={() => setShowConfirm('delete')}
                        title="Delete this chat session"
                        id="delete-chat-button"
                        style={{
                            padding: '8px 12px',
                            borderRadius: '10px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '12px',
                            fontWeight: 500,
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                            e.currentTarget.style.color = '#f87171';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                            e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                        }}
                    >
                        <Trash2 style={{ width: '14px', height: '14px' }} />
                        Delete
                    </button>
                </div>
            )}

            {/* Confirmation Dialog — rendered via Portal to escape backdrop-filter stacking context */}
            {showConfirm && createPortal(
                <>
                    <div
                        onClick={() => setShowConfirm(null)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 40,
                            background: 'rgba(0,0,0,0.4)',
                            backdropFilter: 'blur(4px)',
                        }}
                    />
                    <div className="glass-dark fade-in" style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 50,
                        padding: '28px 32px',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        minWidth: '340px',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            width: '52px', height: '52px', borderRadius: '14px',
                            background: showConfirm === 'delete'
                                ? 'rgba(239, 68, 68, 0.15)'
                                : 'rgba(251, 191, 36, 0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px',
                        }}>
                            {showConfirm === 'delete' ? (
                                <Trash2 style={{ width: '24px', height: '24px', color: '#f87171' }} />
                            ) : (
                                <Eraser style={{ width: '24px', height: '24px', color: '#fbbf24' }} />
                            )}
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'white', margin: '0 0 8px' }}>
                            {showConfirm === 'delete' ? 'Delete Chat?' : 'Clear Chat?'}
                        </h3>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '0 0 24px', lineHeight: 1.5 }}>
                            {showConfirm === 'delete'
                                ? 'This will permanently delete this session and all its messages. This cannot be undone.'
                                : 'This will remove all messages from this chat. The session will be kept.'}
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button
                                onClick={() => setShowConfirm(null)}
                                style={{
                                    padding: '10px 24px',
                                    borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAction}
                                style={{
                                    padding: '10px 24px',
                                    borderRadius: '12px',
                                    background: showConfirm === 'delete'
                                        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                                        : 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: showConfirm === 'delete'
                                        ? '0 4px 15px rgba(239, 68, 68, 0.3)'
                                        : '0 4px 15px rgba(245, 158, 11, 0.3)',
                                }}
                            >
                                {showConfirm === 'delete' ? 'Delete' : 'Clear'}
                            </button>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </header>
    );
};

export default ChatHeader;

