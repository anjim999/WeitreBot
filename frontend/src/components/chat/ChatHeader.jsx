import { Menu, X, Bot, Sparkles } from 'lucide-react';

const ChatHeader = ({ title, sidebarOpen, onToggleSidebar }) => {
    return (
        <header className="glass-dark" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
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
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: '2px 0 0' }}>
                        Powered by Gemini AI • Document-grounded
                    </p>
                </div>
            </div>
        </header>
    );
};

export default ChatHeader;
