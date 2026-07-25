import React, { useState } from 'react';
import { Mail, Edit3, Sparkles, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import type { EmailDraft, ToneType, EngineState } from '../../engine/types';
import { isValidEmail } from '../../engine/conversationMachine';

interface EmailPreviewCardProps {
  draft: EmailDraft;
  currentState: EngineState;
  onUpdateDraft: (field: keyof EmailDraft, value: string) => void;
  onApplyTone: (tone: ToneType) => void;
}

export const EmailPreviewCard: React.FC<EmailPreviewCardProps> = ({
  draft,
  currentState,
  onUpdateDraft,
  onApplyTone,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeChipLoading, setActiveChipLoading] = useState<string | null>(null);
  const tones: ToneType[] = ['Professional', 'Friendly', 'Formal', 'Casual', 'Polite', 'Persuasive', 'Apologetic'];

  // Status mapping
  const getDraftStatus = () => {
    if (currentState === 'COMPLETE') return { label: 'Sent', color: 'var(--accent-emerald)', icon: CheckCircle2 };
    if (currentState === 'CONFIRM_SEND' || currentState === 'SENDING') return { label: 'Ready to Send', color: 'var(--accent-cyan)', icon: CheckCircle2 };
    if (currentState === 'EMAIL_PREVIEW' || currentState === 'SUGGESTION_MODE') return { label: 'Ready for Review', color: 'var(--accent-amber)', icon: Clock };
    return { label: 'Drafting', color: 'var(--text-muted)', icon: Edit3 };
  };

  const statusInfo = getDraftStatus();
  const StatusIcon = statusInfo.icon;

  const handleChipClick = (tone: ToneType) => {
    setActiveChipLoading(tone);
    setTimeout(() => {
      onApplyTone(tone);
      setActiveChipLoading(null);
    }, 600);
  };

  const isRecipientInvalid = Boolean(draft.recipient && !isValidEmail(draft.recipient));

  return (
    <div className="glass-panel" style={{
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      height: '520px',
      gap: '1rem',
      overflowY: 'auto'
    }}>
      {/* Top Header & Draft Status Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Mail size={18} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Email Draft Panel</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Status Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${statusInfo.color}`,
            fontSize: '0.75rem',
            fontWeight: 600,
            color: statusInfo.color
          }}>
            <StatusIcon size={12} />
            <span>{statusInfo.label}</span>
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

      {/* Recipient */}
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
          Recipient
        </label>
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
              border: isRecipientInvalid ? '1px solid var(--accent-rose)' : '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(0,0,0,0.3)',
              color: '#fff',
              outline: 'none',
              fontSize: '0.88rem'
            }}
          />
        ) : (
          <p style={{
            fontSize: '0.9rem',
            fontWeight: 500,
            color: draft.recipient ? 'var(--text-main)' : 'var(--text-dim)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            {draft.recipient || 'Not specified yet'}
          </p>
        )}
        {isRecipientInvalid && (
          <span style={{ fontSize: '0.72rem', color: 'var(--accent-rose)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <AlertTriangle size={12} />
            Invalid email address format
          </span>
        )}
      </div>

      {/* Subject */}
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
          Subject
        </label>
        {isEditing ? (
          <input
            type="text"
            placeholder="Email Subject"
            value={draft.subject}
            onChange={(e) => onUpdateDraft('subject', e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(0,0,0,0.3)',
              color: '#fff',
              outline: 'none',
              fontSize: '0.88rem'
            }}
          />
        ) : (
          <p style={{ fontSize: '0.9rem', fontWeight: 500, color: draft.subject ? 'var(--text-main)' : 'var(--text-dim)' }}>
            {draft.subject || 'Not specified yet'}
          </p>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
          Email Body
        </label>
        {isEditing ? (
          <textarea
            rows={6}
            placeholder="Draft content..."
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
              outline: 'none',
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

      {/* AI Tone Suggestion Chips */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
          <Sparkles size={13} color="var(--accent-indigo)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>AI Tone & Refinement Chips</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {tones.map((t) => {
            const isLoading = activeChipLoading === t;
            const isSelected = draft.tone === t;
            return (
              <button
                key={t}
                onClick={() => handleChipClick(t)}
                disabled={isLoading || !draft.body}
                style={{
                  fontSize: '0.74rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? '1px solid var(--accent-indigo)' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#fff' : 'var(--text-muted)',
                  cursor: draft.body ? 'pointer' : 'not-allowed',
                  opacity: draft.body ? 1 : 0.4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {isLoading && <span className="spinner" style={{ display: 'inline-block', width: '10px', height: '10px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />}
                {t}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
