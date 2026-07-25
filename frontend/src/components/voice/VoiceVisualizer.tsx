import React from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import type { EngineState } from '../../engine/types';

interface VoiceVisualizerProps {
  isListening: boolean;
  isSpeaking: boolean;
  currentState: EngineState;
  onToggleListen: () => void;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  isListening,
  isSpeaking,
  currentState,
  onToggleListen,
}) => {
  return (
    <div className="glass-panel" style={{
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      minHeight: '260px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'relative',
        width: '100px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem'
      }}>
        {/* Glow rings */}
        <div 
          className={isListening || isSpeaking ? 'voice-pulse-active' : ''}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: isListening 
              ? 'radial-gradient(circle, rgba(56,189,248,0.4) 0%, rgba(56,189,248,0) 70%)'
              : isSpeaking
              ? 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(99,102,241,0) 70%)'
              : 'rgba(255, 255, 255, 0.03)',
            transition: 'all 0.3s ease'
          }} 
        />

        <button
          onClick={onToggleListen}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: 'none',
            background: isListening 
              ? 'linear-gradient(135deg, #0284c7, #38bdf8)' 
              : isSpeaking
              ? 'linear-gradient(135deg, #4f46e5, #818cf8)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isListening 
              ? '0 0 25px rgba(56, 189, 248, 0.6)' 
              : '0 4px 15px rgba(0,0,0,0.3)',
            zIndex: 2,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {isListening ? <Mic size={36} /> : isSpeaking ? <Volume2 size={36} /> : <MicOff size={36} color="var(--text-muted)" />}
        </button>
      </div>

      <div style={{ zIndex: 2 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.3rem' }}>
          {isListening ? 'Listening...' : isSpeaking ? 'Assistant Speaking...' : 'Tap Mic to Speak'}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {currentState === 'IDLE' 
            ? 'Or type your command below' 
            : 'Speak naturally to answer questions or issue commands'}
        </p>
      </div>

      {/* Simulated Waveform lines */}
      {(isListening || isSpeaking) && (
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginTop: '1rem', height: '24px' }}>
          {[40, 70, 30, 90, 50, 80, 40].map((h, i) => (
            <div key={i} style={{
              width: '4px',
              height: `${h}%`,
              backgroundColor: isListening ? 'var(--accent-cyan)' : 'var(--accent-indigo)',
              borderRadius: '2px',
              animation: `pulse-ring 1.${i}s infinite alternate ease-in-out`
            }} />
          ))}
        </div>
      )}
    </div>
  );
};
