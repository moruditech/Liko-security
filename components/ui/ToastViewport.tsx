'use client';

import { useToast } from '@/lib/context/ToastContext';
import styles from './ToastViewport.module.css';

export function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.viewport} role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`${styles.toast} ${styles[t.kind]}`}>
          <span>{t.kind === 'error' ? `Error: ${t.message}` : t.message}</span>
          <button type="button" onClick={() => dismissToast(t.id)} aria-label="Dismiss">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
