import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', width: 'fit-content' }}>
      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Assistant typing</span>
      <div style={{ display: 'flex', gap: '4px' }}>
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
};
