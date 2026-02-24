const suggestions = [
    'How do I reset my password?',
    'What are your pricing plans?',
    'How can I contact support?',
    'What is your refund policy?',
    'How do I enable two-factor authentication?',
    'What file formats do you support?'
];

const SuggestionChips = ({ onSelect }) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            maxWidth: '560px',
            width: '100%',
        }}>
            {suggestions.map((text) => (
                <button
                    key={text}
                    onClick={() => onSelect(text)}
                    className="suggestion-chip"
                    type="button"
                >
                    {text}
                </button>
            ))}
        </div>
    );
};

export default SuggestionChips;
