import type { Faq } from '@/types/api';
import styles from './CourseManagementTable.module.css';

interface FaqManagementListProps {
  faqs: Faq[];
  onMove: (faq: Faq, direction: 'up' | 'down') => void;
  onEdit: (faq: Faq) => void;
  onToggleActive: (faq: Faq) => void;
  onDelete: (faq: Faq) => void;
}

export function FaqManagementList({ faqs, onMove, onEdit, onToggleActive, onDelete }: FaqManagementListProps) {
  const sorted = [...faqs].sort((a, b) => a.order - b.order);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Question</th>
          <th>Active</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {sorted.map((faq, i) => (
          <tr key={faq.id}>
            <td>{faq.question}</td>
            <td>
              <button type="button" onClick={() => onToggleActive(faq)}>
                {faq.active ? 'Active' : 'Inactive'}
              </button>
            </td>
            <td>
              <button type="button" onClick={() => onMove(faq, 'up')} disabled={i === 0} aria-label="Move up">
                ↑
              </button>
              <button
                type="button"
                onClick={() => onMove(faq, 'down')}
                disabled={i === sorted.length - 1}
                aria-label="Move down"
              >
                ↓
              </button>
              <button type="button" onClick={() => onEdit(faq)}>
                Edit
              </button>
              <button type="button" onClick={() => onDelete(faq)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
