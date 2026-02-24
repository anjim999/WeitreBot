import { Plus, MessageSquare, Trash2, Bot } from 'lucide-react';
import { formatTimestamp } from '../../utils/session';

const SessionSidebar = ({
    sessions,
    currentSessionId,
    onNewChat,
    onSelectSession,
    onDeleteSession,
    onClose
}) => {
    return (
        <aside className="glass-dark" style={{
            position: 'fixed',
            zIndex: 30,
            width: '280px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Sidebar Header */}
            <div style={{
                padding: '16px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
                <button
                    onClick={onNewChat}
                    className="btn-primary"
                    id="new-chat-button"
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '14px',
                    }}
                >
                    <Plus style={{ width: '18px', height: '18px' }} />
                    New Chat
                </button>
            </div>

            {/* Sessions List */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
            }}>
                {sessions.map((session) => {
                    const isActive = session.id === currentSessionId;
                    const title = session.first_message
                        ? session.first_message.substring(0, 35) + (session.first_message.length > 35 ? '...' : '')
                        : 'New Chat';

                    return (
                        <div
                            key={session.id}
                            className={`sidebar-item ${isActive ? 'active' : ''}`}
                            onClick={() => onSelectSession(session.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                position: 'relative',
                            }}
                        >
                            <MessageSquare style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                    fontSize: '13px', color: 'rgba(255,255,255,0.8)',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    margin: 0,
                                }}>
                                    {title}
                                </p>
                                <p style={{
                                    fontSize: '10px', color: 'rgba(255,255,255,0.3)',
                                    marginTop: '4px', marginBottom: 0,
                                }}>
                                    {formatTimestamp(session.updated_at)} • {session.message_count || 0} msgs
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteSession(session.id);
                                }}
                                style={{
                                    opacity: 0,
                                    padding: '6px',
                                    borderRadius: '8px',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'opacity 0.2s',
                                }}
                                className="group-delete-btn"
                                aria-label="Delete session"
                            >
                                <Trash2 style={{ width: '14px', height: '14px', color: '#f87171' }} />
                            </button>
                        </div>
                    );
                })}

                {sessions.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '48px 16px',
                        color: 'rgba(255,255,255,0.3)',
                    }}>
                        <Bot style={{ width: '40px', height: '40px', margin: '0 auto 12px', opacity: 0.4 }} />
                        <p style={{ fontSize: '14px', margin: 0 }}>No conversations yet</p>
                        <p style={{ fontSize: '12px', marginTop: '4px' }}>Start a new chat!</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div style={{
                padding: '16px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'linear-gradient(135deg, #818cf8, #764ba2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Bot style={{ width: '16px', height: '16px', color: 'white' }} />
                    </div>
                    <div>
                        <p style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                            AI Support Assistant
                        </p>
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', margin: '2px 0 0' }}>
                            v1.0.0 • Gemini Powered
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default SessionSidebar;
