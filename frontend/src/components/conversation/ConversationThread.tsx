import React, { useRef, useEffect } from 'react';
import type { ChatMessage, EngineState } from '../../engine/types';
import { Mic, Sparkles, MessageSquare } from 'lucide-react';

interface ConversationThreadProps {
  messages: ChatMessage[];
  currentState: EngineState;
  isListening: boolean;
  isSpeaking: boolean;
  onStartVoice: () => void;
}

export const ConversationThread: React.FC<ConversationThreadProps> = ({
  messages,
  currentState,
  isListening,
  isSpeaking,
  onStartVoice,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentState]);

  const isEmpty = messages.length <= 1 && currentState === 'IDLE';

  return (
    <div className="glass-panel" style={{
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      height: '520px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header title */}
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
        
        {/* Status Indicator */}
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

      {/* Main Message Stream or Empty State */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.25rem' }}>
        {isEmpty ? (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Mic size={32} color="var(--accent-cyan)" />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Ready to help you send your next email.
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '320px', marginBottom: '1.5rem' }}>
              Press the microphone and start speaking naturally.
            </p>
            <button
              onClick={onStartVoice}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Sparkles size={16} />
              Start Voice Conversation
            </button>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const formattedTime = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <div
                key={msg.id}
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
                    lineHeight: '1.45'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.25rem', opacity: 0.75, fontSize: '0.7rem', fontWeight: 600 }}>
                    <span>{isUser ? 'YOU' : 'VOICEMAIL AI'}</span>
                    <span>{formattedTime}</span>
                  </div>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {(currentState === 'AI_GENERATING' || currentState === 'SENDING') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', width: 'fit-content' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Assistant typing</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Live Transcript Caption Bar */}
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
