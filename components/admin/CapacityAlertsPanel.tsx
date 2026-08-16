import type { CapacityAlert } from '@/types/api';
import styles from './CapacityAlertsPanel.module.css';

interface CapacityAlertsPanelProps {
  alerts: CapacityAlert[];
  loading?: boolean;
}

const ALERT_LABEL: Record<'full' | 'approaching' | 'low', string> = {
  full: 'Full',
  approaching: 'Filling up',
  low: 'Low interest',
};

export function CapacityAlertsPanel({ alerts, loading }: CapacityAlertsPanelProps) {
  // Only intakes with a real alert are shown here, quiet intakes with
  // normal fill rates don't need a spot on this list.
  const flagged = alerts.filter((a) => a.alertLevel !== null);

  return (
    <div className={styles.panel}>
      <h2>Capacity alerts</h2>
      {loading ? (
        <p className={styles.empty}>Loading...</p>
      ) : flagged.length === 0 ? (
        <p className={styles.empty}>No upcoming intakes need attention right now.</p>
      ) : (
        <ul className={styles.list}>
          {flagged.map((alert) => (
            <li key={alert.id}>
              <div className={styles.row}>
                <div className={styles.info}>
                  <span className={styles.title}>{alert.title}</span>
                  <span className={styles.meta}>
                    {new Date(alert.startDate).toLocaleDateString('en-ZA')} &middot; {alert.applicableGrades.map((g) => `Grade ${g}`).join(', ')} &middot;{' '}
                    {alert.daysUntilStart} {alert.daysUntilStart === 1 ? 'day' : 'days'} away
                  </span>
                </div>
                <div className={styles.fill}>
                  <span className={styles.fillCount}>
                    {alert.enrolled}
                    {alert.capacity !== null ? ` / ${alert.capacity}` : ''} enrolled
                    {alert.fillRate !== null ? ` (${alert.fillRate}%)` : ''}
                  </span>
                  {alert.alertLevel && <span className={`${styles.chip} ${styles[`chip_${alert.alertLevel}`]}`}>{ALERT_LABEL[alert.alertLevel]}</span>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
