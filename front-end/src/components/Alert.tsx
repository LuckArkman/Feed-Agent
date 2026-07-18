import React from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
  className?: string;
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  onClose,
  className = '',
}) => {
  const Icon = icons[variant];

  return (
    <div className={`alert alert-${variant} glass-panel ${className}`} role="alert">
      <div className="alert-content-wrapper">
        <Icon className="alert-icon" size={20} />
        <div className="alert-message">{children}</div>
      </div>
      {onClose && (
        <button type="button" className="alert-close-btn" onClick={onClose} aria-label="Fechar alerta">
          <X size={16} aria-hidden />
        </button>
      )}
    </div>
  );
};
export default Alert;
