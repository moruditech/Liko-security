import type { Testimonial } from '@/types/api';
import styles from './CourseManagementTable.module.css';

interface TestimonialManagementListProps {
  testimonials: Testimonial[];
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (testimonial: Testimonial) => void;
}

export function TestimonialManagementList({ testimonials, onEdit, onDelete }: TestimonialManagementListProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Grade</th>
          <th>Quote</th>
          <th>Featured</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {testimonials.map((t) => (
          <tr key={t.id}>
            <td>{t.name}</td>
            <td>{t.grade}</td>
            <td>{t.quote.slice(0, 60)}{t.quote.length > 60 ? '...' : ''}</td>
            <td>{t.featured ? 'Yes' : 'No'}</td>
            <td>
              <button type="button" onClick={() => onEdit(t)}>
                Edit
              </button>
              <button type="button" onClick={() => onDelete(t)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
