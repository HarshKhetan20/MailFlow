import React, { useRef, useEffect } from 'react';
import type { ConversationMessage, EngineState } from '../../types/conversation';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { MessageSquare, Mic } from 'lucide-react';

interface ConversationPanelProps {
  messages: ConversationMessage[];
  currentState: EngineState;
  isListening: boolean;
  isSpeaking: boolean;
  onStartVoice?: () => void;
}

export const ConversationPanel: React.FC<ConversationPanelProps> = ({
  messages,
  currentState,
  isListening,
  isSpeaking,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentState]);

  return (
    <div className="glass-panel" style={{
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      height: '520px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '0.8rem',
        marginBottom: '1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={16} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Conversation Panel</h3>
        </div>
        
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: isListening ? 'var(--accent-rose)' : isSpeaking ? 'var(--accent-indigo)' : 'var(--accent-emerald)'
          }} />
          <span>{isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.25rem' }}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {(currentState === 'AI_GENERATING' || currentState === 'SENDING') && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      {isListening && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.6rem 0.9rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          fontSize: '0.82rem',
          color: 'var(--accent-cyan)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Mic size={14} className="voice-pulse-active" />
          <span>Listening... speak now. Live transcript active.</span>
        </div>
      )}
    </div>
  );
};
