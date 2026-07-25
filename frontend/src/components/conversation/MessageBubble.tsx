import React from 'react';
import type { ConversationMessage } from '../../types/conversation';

interface MessageBubbleProps {
  message: ConversationMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        style={{
          maxWidth: '82%',
          padding: '0.85rem 1.15rem',
          borderRadius: isUser ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
          background: isUser
            ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))'
            : 'rgba(255, 255, 255, 0.05)',
          color: '#fff',
          border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: isUser ? '0 4px 14px rgba(56, 189, 248, 0.22)' : 'none',
          fontSize: '0.92rem',
          lineHeight: '1.45',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.25rem', opacity: 0.75, fontSize: '0.7rem', fontWeight: 600 }}>
          <span>{isUser ? 'YOU' : 'VOICEMAIL AI'}</span>
          <span>{formattedTime}</span>
        </div>
        <p style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
      </div>
    </div>
  );
};
