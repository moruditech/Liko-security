import type { ApplicationStatus } from '@/types/api';
import { APPLICATION_STATUS_ORDER } from '@/lib/constants/applicationStatus';
import styles from './StatusStepper.module.css';

export function StatusStepper({ status }: { status: ApplicationStatus }) {
  if (status === 'rejected') {
    return (
      <div className={styles.rejected}>
        <strong>Rejected</strong>
      </div>
    );
  }

  const currentIndex = APPLICATION_STATUS_ORDER.indexOf(status);

  return (
    <ol className={styles.stepper}>
      {APPLICATION_STATUS_ORDER.map((step, i) => (
        <li key={step} className={i <= currentIndex ? styles.done : undefined}>
          {step.replace('_', ' ')}
        </li>
      ))}
    </ol>
  );
}
