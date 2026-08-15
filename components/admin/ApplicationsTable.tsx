import Link from 'next/link';
import type { Application } from '@/types/api';
import { StatusChip } from './StatusChip';
import styles from './ApplicationsTable.module.css';

export function ApplicationsTable({ applications }: { applications: Application[] }) {
  if (applications.length === 0) {
    return (
      <div className={styles.card}>
        <p className={styles.empty}>No applications match these filters.</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Reference</th>
            <th>Applicant</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>
                <Link href={`/admin/applications/${app.id}`} className={`mono ${styles.refLink}`}>
                  {app.referenceCode}
                </Link>
              </td>
              <td>
                <Link href={`/admin/applications/${app.id}`} className={styles.nameLink}>
                  {app.firstName} {app.lastName}
                </Link>
              </td>
              <td>
                <StatusChip status={app.status} kind="application" />
              </td>
              <td className="mono">R{app.totalAmount.toLocaleString('en-ZA')}</td>
              <td>{new Date(app.createdAt).toLocaleDateString('en-ZA')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
