import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Inbox, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/Button';

interface StatePanelProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'empty' | 'error' | 'loading';
}

export const StatePanel: React.FC<StatePanelProps> = ({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
  variant = 'empty',
}) => {
  const FallbackIcon = variant === 'error' ? AlertCircle : variant === 'loading' ? Loader2 : Inbox;
  const Resolved = Icon || FallbackIcon;

  return (
    <div className="glass-panel state-panel" role="status" aria-live="polite">
      <Resolved
        size={28}
        aria-hidden
        style={{
          color: variant === 'error' ? 'var(--error)' : 'var(--primary)',
          animation: variant === 'loading' ? 'spin 0.8s linear infinite' : undefined,
        }}
      />
      <div className="state-panel__title">{title}</div>
      {description && <p className="state-panel__desc">{description}</p>}
      {actionLabel && onAction && (
        <Button type="button" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default StatePanel;
