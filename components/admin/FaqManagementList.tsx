import type { Faq } from '@/types/api';
import styles from './FaqManagementList.module.css';

interface FaqManagementListProps {
  faqs: Faq[];
  onMove: (faq: Faq, direction: 'up' | 'down') => void;
  onEdit: (faq: Faq) => void;
  onToggleActive: (faq: Faq) => void;
  onDelete: (faq: Faq) => void;
}

export function FaqManagementList({ faqs, onMove, onEdit, onToggleActive, onDelete }: FaqManagementListProps) {
  const sorted = [...faqs].sort((a, b) => a.order - b.order);

  if (sorted.length === 0) {
    return (
      <div className={styles.card}>
        <p className={styles.empty}>No FAQs yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Question</th>
            <th>Status</th>
            <th className={styles.actionsHeader} />
          </tr>
        </thead>
        <tbody>
          {sorted.map((faq, i) => (
            <tr key={faq._id}>
              <td className={styles.questionCell}>{faq.question}</td>
              <td>
                <button
                  type="button"
                  className={`${styles.statusPill} ${faq.isActive ? styles.active : styles.inactive}`}
                  onClick={() => onToggleActive(faq)}
                >
                  {faq.isActive ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td className={styles.actionsCell}>
                <button type="button" className={styles.iconButton} onClick={() => onMove(faq, 'up')} disabled={i === 0} aria-label="Move up">
                  <ArrowUpIcon />
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => onMove(faq, 'down')}
                  disabled={i === sorted.length - 1}
                  aria-label="Move down"
                >
                  <ArrowDownIcon />
                </button>
                <button type="button" className={styles.textButton} onClick={() => onEdit(faq)}>
                  Edit
                </button>
                <button type="button" className={styles.deleteButton} onClick={() => onDelete(faq)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  );
}
