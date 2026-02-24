import { Bot } from 'lucide-react';

const TypingIndicator = () => {
    return (
        <div className="message-enter" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{
                flexShrink: 0, width: '36px', height: '36px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #764ba2, #ec4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <Bot style={{ width: '18px', height: '18px', color: 'white' }} />
            </div>
            <div className="glass" style={{
                padding: '16px 20px',
                borderRadius: '16px',
                borderTopLeftRadius: '4px',
                display: 'flex',
                gap: '6px',
                alignItems: 'center',
            }}>
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
            </div>
        </div>
    );
};

export default TypingIndicator;
