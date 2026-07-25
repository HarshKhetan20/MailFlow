import React, { useState } from 'react';
import { Mic, RefreshCw, Settings, CheckCircle2, AlertCircle, User } from 'lucide-react';
import type { EngineState } from '../../engine/types';

interface HeaderProps {
  currentState: EngineState;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentState, onReset }) => {
  const [isGmailConnected] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header 
      role="banner"
      className="glass-panel" 
      style={{
        position: 'sticky',
        top: '1rem',
        zIndex: 40,
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
      }}
    >
      {/* Product Logo & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{ 
          width: '42px', 
          height: '42px', 
          borderRadius: '12px', 
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(56, 189, 248, 0.35)'
        }}>
          <Mic size={22} color="#fff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              MailFlow
            </h1>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '0.15rem 0.4rem',
              borderRadius: '4px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}>
              V1.0
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Conversational Voice-First Assistant</p>
        </div>
      </div>

      {/* Connection Status & Profile Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Engine State Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.3rem 0.65rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: currentState === 'IDLE' ? '#94a3b8' : 'var(--accent-cyan)'
          }} />
          <span>{currentState.replace(/_/g, ' ')}</span>
        </div>

        {/* Gmail Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.35rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          background: isGmailConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
          border: isGmailConnected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
          fontSize: '0.78rem',
          fontWeight: 500,
          color: isGmailConnected ? 'var(--accent-emerald)' : 'var(--accent-rose)'
        }}>
          {isGmailConnected ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
          <span>{isGmailConnected ? 'Gmail Connected' : 'Offline Mode'}</span>
        </div>

        {/* Account Avatar */}
        <div 
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #334155, #1e293b)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-main)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          title="Executive Account: user@example.com"
        >
          <User size={16} />
        </div>

        {/* Reset Action */}
        <button 
          onClick={onReset}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--bg-card-border)',
            color: 'var(--text-muted)',
            padding: '0.45rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            transition: 'all var(--transition-fast)'
          }}
          title="Reset Session"
        >
          <RefreshCw size={14} />
          <span>Reset</span>
        </button>

        {/* Settings Icon */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.4rem',
            borderRadius: 'var(--radius-sm)'
          }}
          title="Application Settings"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};
