import type { Testimonial } from '@/types/api';
import styles from './TestimonialManagementList.module.css';

interface TestimonialManagementListProps {
  testimonials: Testimonial[];
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (testimonial: Testimonial) => void;
}

export function TestimonialManagementList({ testimonials, onEdit, onDelete }: TestimonialManagementListProps) {
  if (testimonials.length === 0) {
    return (
      <div className={styles.card}>
        <p className={styles.empty}>No testimonials yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Grade</th>
            <th>Quote</th>
            <th>Featured</th>
            <th className={styles.actionsHeader} />
          </tr>
        </thead>
        <tbody>
          {testimonials.map((t) => (
            <tr key={t.id}>
              <td className={styles.nameCell}>{t.name}</td>
              <td>{t.grade}</td>
              <td className={styles.quoteCell}>
                {t.quote.slice(0, 60)}
                {t.quote.length > 60 ? '...' : ''}
              </td>
              <td>
                {t.featured ? (
                  <span className={`${styles.pill} ${styles.featured}`}>Featured</span>
                ) : (
                  <span className={styles.pill}>Not featured</span>
                )}
              </td>
              <td className={styles.actionsCell}>
                <button type="button" className={styles.textButton} onClick={() => onEdit(t)}>
                  Edit
                </button>
                <button type="button" className={styles.deleteButton} onClick={() => onDelete(t)}>
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
