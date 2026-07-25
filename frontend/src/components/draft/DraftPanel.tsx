import React, { useState } from 'react';
import type { EmailDraft, ToneType, EngineState } from '../../types';
import { SuggestionChips } from '../suggestions/SuggestionChips';
import { Mail, Edit3, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface DraftPanelProps {
  draft: EmailDraft;
  currentState: EngineState;
  onUpdateDraft: (field: keyof EmailDraft, value: string) => void;
  onApplyTone: (tone: ToneType) => void;
}

export const DraftPanel: React.FC<DraftPanelProps> = ({
  draft,
  currentState,
  onUpdateDraft,
  onApplyTone,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const getStatusBadge = () => {
    if (currentState === 'COMPLETE') return { label: 'Sent', color: 'var(--accent-emerald)', icon: CheckCircle2 };
    if (currentState === 'CONFIRM_SEND' || currentState === 'SENDING') return { label: 'Ready to Send', color: 'var(--accent-cyan)', icon: CheckCircle2 };
    if (currentState === 'EMAIL_PREVIEW' || currentState === 'SUGGESTION_MODE') return { label: 'Ready for Review', color: 'var(--accent-amber)', icon: Clock };
    return { label: 'Drafting', color: 'var(--text-muted)', icon: Edit3 };
  };

  const status = getStatusBadge();
  const StatusIcon = status.icon;

  const isEmailValid = !draft.recipient || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.recipient);

  return (
    <div className="glass-panel" style={{
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      height: '520px',
      gap: '1rem',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Mail size={18} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Email Draft Panel</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${status.color}`,
            fontSize: '0.75rem',
            fontWeight: 600,
            color: status.color
          }}>
            <StatusIcon size={12} />
            <span>{status.label}</span>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Edit3 size={13} />
            {isEditing ? 'Done' : 'Manual Edit'}
          </button>
        </div>
      </div>

      {/* Recipient Field */}
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Recipient</label>
        {isEditing ? (
          <input
            type="email"
            placeholder="recipient@example.com"
            value={draft.recipient}
            onChange={(e) => onUpdateDraft('recipient', e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: !isEmailValid ? '1px solid var(--accent-rose)' : '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(0,0,0,0.3)',
              color: '#fff',
              fontSize: '0.88rem'
            }}
          />
        ) : (
          <p style={{ fontSize: '0.9rem', fontWeight: 500, color: draft.recipient ? 'var(--text-main)' : 'var(--text-dim)' }}>
            {draft.recipient || 'Not specified yet'}
          </p>
        )}
        {!isEmailValid && (
          <span style={{ fontSize: '0.72rem', color: 'var(--accent-rose)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <AlertTriangle size={12} />
            Invalid email address format
          </span>
        )}
      </div>

      {/* Subject Field */}
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Subject</label>
        {isEditing ? (
          <input
            type="text"
            placeholder="Subject line..."
            value={draft.subject}
            onChange={(e) => onUpdateDraft('subject', e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(0,0,0,0.3)',
              color: '#fff',
              fontSize: '0.88rem'
            }}
          />
        ) : (
          <p style={{ fontSize: '0.9rem', fontWeight: 500, color: draft.subject ? 'var(--text-main)' : 'var(--text-dim)' }}>
            {draft.subject || 'Not specified yet'}
          </p>
        )}
      </div>

      {/* Body Field */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Email Body</label>
        {isEditing ? (
          <textarea
            rows={6}
            value={draft.body}
            onChange={(e) => onUpdateDraft('body', e.target.value)}
            style={{
              width: '100%',
              flex: 1,
              padding: '0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(0,0,0,0.3)',
              color: '#fff',
              resize: 'none',
              fontSize: '0.88rem',
              lineHeight: '1.45'
            }}
          />
        ) : (
          <div style={{
            flex: 1,
            minHeight: '120px',
            padding: '0.85rem',
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            fontSize: '0.88rem',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap',
            color: draft.body ? 'var(--text-main)' : 'var(--text-dim)'
          }}>
            {draft.body || 'Draft contents will render here as you speak...'}
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      <SuggestionChips
        currentTone={draft.tone}
        isDisabled={!draft.body}
        onApplyTone={onApplyTone}
      />
    </div>
  );
};
