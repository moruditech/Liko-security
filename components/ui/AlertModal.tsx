'use client';

import styles from './AlertModal.module.css';

export type AlertVariant = 'success' | 'warning' | 'error' | 'info';

interface AlertModalProps {
  open: boolean;
  variant: AlertVariant;
  title: string;
  description: string;
  /** Single-button variants (success/error/info) use this label. Ignored for 'warning'. */
  actionLabel?: string;
  onAction: () => void;
  /** Warning variant only: renders a second "Stay" button alongside the primary action. */
  onStay?: () => void;
  onClose: () => void;
}

const DEFAULT_ACTION_LABEL: Record<AlertVariant, string> = {
  success: 'Okay',
  warning: 'Leave',
  error: 'Try again',
  info: 'Got it',
};

/**
 * New component, no existing usage in the codebase yet. Ready to drop into
 * any flow that currently uses a toast for a moment that deserves a harder
 * stop (e.g. an "unsaved changes" warning before closing an edit modal),
 * without changing anything that already works.
 */
export function AlertModal({ open, variant, title, description, actionLabel, onAction, onStay, onClose }: AlertModalProps) {
  if (!open) return null;

  return (
    <div className={styles.overlay} role="alertdialog" aria-modal="true" onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>

        <span className={styles[`iconCircle_${variant}`]}>
          <VariantIcon variant={variant} />
        </span>

        <h2>{title}</h2>
        <p>{description}</p>

        <div className={styles.actions}>
          {variant === 'warning' && onStay && (
            <button type="button" onClick={onStay} className={styles.stayButton}>
              Stay
            </button>
          )}
          <button type="button" onClick={onAction} className={styles[`actionButton_${variant}`]}>
            {actionLabel ?? DEFAULT_ACTION_LABEL[variant]}
          </button>
        </div>
      </div>
    </div>
  );
}

function VariantIcon({ variant }: { variant: AlertVariant }) {
  switch (variant) {
    case 'success':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    case 'warning':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 9v4M12 17h.01M10.3 3.9L2.7 17a2 2 0 001.7 3h15.2a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
        </svg>
      );
    case 'error':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M15 9l-6 6M9 9l6 6" />
        </svg>
      );
    case 'info':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      );
  }
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
