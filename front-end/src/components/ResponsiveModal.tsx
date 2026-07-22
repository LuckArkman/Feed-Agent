import React, { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export type ModalSize = 'md' | 'lg' | 'xl' | 'connection';

interface ResponsiveModalProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  labelledById?: string;
  /** Classe extra no dialog (ex.: connection-modal). */
  dialogClassName?: string;
}

/**
 * Modal base com portal em document.body.
 * Header e footer fora do scroll; apenas .modal-body rola.
 */
export const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
  size = 'md',
  labelledById,
  dialogClassName = '',
}) => {
  const autoId = useId();
  const titleId = labelledById || `modal-title-${autoId}`;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  const sizeClass =
    size === 'lg'
      ? 'modal-dialog--lg'
      : size === 'xl'
        ? 'modal-dialog--xl'
        : size === 'connection'
          ? 'modal-dialog--connection connection-modal'
          : '';

  return createPortal(
    <div className="modal-overlay" data-testid="modal-overlay" onClick={onClose}>
      <section
        className={`modal-dialog ${sizeClass} ${dialogClassName}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid="modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header" data-testid="modal-header">
          <div className="modal-header__copy">
            <h2 id={titleId} className="modal-title truncate" title={title}>
              {title}
            </h2>
            {subtitle ? (
              <p className="modal-subtitle truncate" title={subtitle}>
                {subtitle}
              </p>
            ) : null}
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar modal">
            <X size={18} aria-hidden />
          </button>
        </header>

        <div className="modal-body" data-testid="modal-body">
          {children}
        </div>

        {footer ? (
          <footer className="modal-footer" data-testid="modal-footer">
            {footer}
          </footer>
        ) : null}
      </section>
    </div>,
    document.body,
  );
};

export default ResponsiveModal;
