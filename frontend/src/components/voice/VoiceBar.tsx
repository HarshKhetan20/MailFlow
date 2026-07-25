import React from 'react';
import type { EngineState } from '../../types/conversation';
import { Mic, MicOff, Volume2, Send, X, Loader2 } from 'lucide-react';

interface VoiceBarProps {
  isListening: boolean;
  isSpeaking: boolean;
  currentState: EngineState;
  onToggleListen: () => void;
  onCancel: () => void;
  onConfirmSend: () => void;
  canSend: boolean;
}

export const VoiceBar: React.FC<VoiceBarProps> = ({
  isListening,
  isSpeaking,
  currentState,
  onToggleListen,
  onCancel,
  onConfirmSend,
  canSend,
}) => {
  const isProcessing = currentState === 'AI_GENERATING' || currentState === 'SENDING';
  const isConfirmReady = currentState === 'CONFIRM_SEND' || currentState === 'EMAIL_PREVIEW' || currentState === 'SUGGESTION_MODE';

  const getMicStatusLabel = () => {
    if (isProcessing) return 'Processing speech...';
    if (isListening) return 'Listening... speak now';
    if (isSpeaking) return 'Assistant speaking...';
    if (currentState === 'IDLE') return 'Press Mic to Start';
    return 'Voice active — tap mic to pause';
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      padding: '0.85rem 1.5rem',
      background: 'rgba(8, 12, 20, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '140px' }}>
          {currentState !== 'IDLE' && (
            <button
              onClick={onCancel}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-muted)',
                padding: '0.55rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <X size={14} />
              <span>Cancel</span>
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={onToggleListen}
            disabled={isProcessing}
            aria-label={getMicStatusLabel()}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: 'none',
              background: isProcessing
                ? 'linear-gradient(135deg, #334155, #1e293b)'
                : isListening
                ? 'linear-gradient(135deg, #0284c7, #38bdf8)'
                : isSpeaking
                ? 'linear-gradient(135deg, #4f46e5, #818cf8)'
                : 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))',
              color: '#fff',
              cursor: isProcessing ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isListening ? '0 0 30px rgba(56, 189, 248, 0.7)' : '0 4px 20px rgba(56, 189, 248, 0.35)',
            }}
            className={isListening ? 'voice-pulse-active' : ''}
          >
            {isProcessing ? <Loader2 size={28} className="spinner" /> : isListening ? <Mic size={28} /> : isSpeaking ? <Volume2 size={28} /> : <MicOff size={28} color="rgba(255,255,255,0.7)" />}
          </button>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {getMicStatusLabel()}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '140px', justifyContent: 'flex-end' }}>

          <button
            onClick={onConfirmSend}
            disabled={!canSend || !isConfirmReady}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: canSend && isConfirmReady ? 'linear-gradient(135deg, var(--accent-emerald), #059669)' : 'rgba(255, 255, 255, 0.08)',
              color: canSend && isConfirmReady ? '#fff' : 'var(--text-dim)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: canSend && isConfirmReady ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: canSend && isConfirmReady ? '0 4px 15px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            <Send size={14} />
            <span>Send Email</span>
          </button>
        </div>
      </div>
    </div>
  );
};
