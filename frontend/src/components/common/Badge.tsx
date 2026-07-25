import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'listening' | 'processing' | 'draft' | 'ready' | 'sent';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'draft' }) => {
  const getColors = () => {
    switch (variant) {
      case 'listening':
        return { bg: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-rose)', border: 'rgba(244, 63, 94, 0.3)' };
      case 'processing':
        return { bg: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-indigo)', border: 'rgba(99, 102, 241, 0.3)' };
      case 'ready':
      case 'sent':
        return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', border: 'rgba(16, 185, 129, 0.3)' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', border: 'rgba(255, 255, 255, 0.1)' };
    }
  };

  const style = getColors();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.25rem 0.65rem',
        borderRadius: 'var(--radius-full)',
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        fontSize: '0.75rem',
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
};
