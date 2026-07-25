import React from 'react';
import type { ToneType } from '../../types/draft';
import { Sparkles } from 'lucide-react';

interface SuggestionChipsProps {
  currentTone?: ToneType;
  isDisabled: boolean;
  onApplyTone: (tone: ToneType) => void;
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  currentTone,
  isDisabled,
  onApplyTone,
}) => {
  const tones: ToneType[] = ['Professional', 'Friendly', 'Formal', 'Casual', 'Polite', 'Persuasive', 'Apologetic'];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
        <Sparkles size={13} color="var(--accent-indigo)" />
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>AI Tone & Refinement Chips</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {tones.map((t) => {
          const isSelected = currentTone === t;
          return (
            <button
              key={t}
              onClick={() => onApplyTone(t)}
              disabled={isDisabled}
              style={{
                fontSize: '0.74rem',
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                border: isSelected ? '1px solid var(--accent-indigo)' : '1px solid rgba(255, 255, 255, 0.08)',
                background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                color: isSelected ? '#fff' : 'var(--text-muted)',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.4 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'all var(--transition-fast)',
              }}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
};
