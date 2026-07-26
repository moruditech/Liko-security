'use client';

import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" onClick={onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className={styles.actions}>
          <button type="button" onClick={onCancel} className={styles.cancel}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className={destructive ? styles.destructive : styles.confirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
