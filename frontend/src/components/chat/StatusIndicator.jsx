import { Search, Brain, FileText, Sparkles, Check } from 'lucide-react';

const stageIcons = {
    session: Sparkles,
    searching: Search,
    docs_found: FileText,
    analyzing: Brain,
    generating: Sparkles
};

const stageColors = {
    session: '#60a5fa',
    searching: '#fbbf24',
    docs_found: '#34d399',
    analyzing: '#a78bfa',
    generating: '#f472b6'
};

const StatusIndicator = ({ stages }) => {
    return (
        <div className="message-enter" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{
                flexShrink: 0, width: '36px', height: '36px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #764ba2, #ec4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <Brain style={{ width: '18px', height: '18px', color: 'white' }} />
            </div>
            <div className="glass" style={{
                padding: '14px 18px',
                borderRadius: '16px',
                borderTopLeftRadius: '4px',
                minWidth: '240px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
            }}>
                {stages.map((stage, index) => {
                    const isLatest = index === stages.length - 1;
                    const IconComponent = stageIcons[stage.stage] || Sparkles;
                    const color = stageColors[stage.stage] || 'rgba(255,255,255,0.6)';

                    return (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontSize: '13px',
                                opacity: isLatest ? 1 : 0.5,
                                transition: 'opacity 0.3s',
                            }}
                        >
                            {isLatest ? (
                                <IconComponent className="status-pulse" style={{ width: '16px', height: '16px', color }} />
                            ) : (
                                <Check style={{ width: '16px', height: '16px', color: '#34d399' }} />
                            )}
                            <span className={isLatest ? 'status-pulse' : ''} style={{
                                color: isLatest ? color : 'rgba(255,255,255,0.4)',
                                fontWeight: isLatest ? 500 : 400,
                            }}>
                                {stage.message}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StatusIndicator;
