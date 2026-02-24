import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

const MessageInput = ({ onSend, isLoading }) => {
    const [input, setInput] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (!isLoading) {
            inputRef.current?.focus();
        }
    }, [isLoading]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;
        onSend(trimmed);
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="glass-dark" style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
            <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ position: 'relative' }}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about our product, pricing, features..."
                        className="input-glass"
                        disabled={isLoading}
                        autoComplete="off"
                        id="chat-input"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="send-btn"
                        id="send-button"
                        aria-label="Send message"
                    >
                        {isLoading ? (
                            <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                        ) : (
                            <Send style={{ width: '20px', height: '20px' }} />
                        )}
                    </button>
                </div>
            </form>
            <p style={{
                textAlign: 'center', fontSize: '11px',
                color: 'rgba(255,255,255,0.2)', marginTop: '12px',
            }}>
                AI answers are based on product documentation only
            </p>
        </div>
    );
};

export default MessageInput;
