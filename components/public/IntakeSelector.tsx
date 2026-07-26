import type { Course, Intake } from '@/types/api';
import styles from './IntakeSelector.module.css';

interface IntakeSelectorProps {
  intakes: Intake[];
  courses: Course[];
  value: string;
  onChange: (intakeId: string) => void;
}

export function IntakeSelector({ intakes, courses, value, onChange }: IntakeSelectorProps) {
  function courseTitle(courseId: string) {
    return courses.find((c) => c.id === courseId)?.title ?? 'Unknown course';
  }

  return (
    <div className={styles.field}>
      <label htmlFor="intake">Preferred intake</label>
      <select id="intake" value={value} onChange={(e) => onChange(e.target.value)} required>
        <option value="" disabled>
          Choose an intake
        </option>
        {intakes.map((intake) => (
          <option key={intake.id} value={intake.id}>
            {courseTitle(intake.courseId)}: starts {new Date(intake.startDate).toLocaleDateString('en-ZA')}
          </option>
        ))}
      </select>
    </div>
  );
}
