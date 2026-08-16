import type { Intake } from '@/types/api';
import styles from './IntakeSelector.module.css';

interface IntakeSelectorProps {
  intakes: Intake[];
  value: string;
  onChange: (intakeId: string) => void;
}

// Intakes reference grades directly (applicableGrades), not a specific
// course — there was never a "course" to look up here.
export function IntakeSelector({ intakes, value, onChange }: IntakeSelectorProps) {
  return (
    <div className={styles.field}>
      <label htmlFor="intake">Preferred intake</label>
      <select id="intake" value={value} onChange={(e) => onChange(e.target.value)} required>
        <option value="" disabled>
          Choose an intake
        </option>
        {intakes.map((intake) => (
          <option key={intake.id} value={intake.id}>
            {intake.title} (Grade{intake.applicableGrades.length > 1 ? 's' : ''} {intake.applicableGrades.join(', ')}) —
            starts {new Date(intake.startDate).toLocaleDateString('en-ZA')}
          </option>
        ))}
      </select>
    </div>
  );
}
