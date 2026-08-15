import Link from 'next/link';
import type { Application } from '@/types/api';
import { StatusChip } from './StatusChip';
import styles from './ApplicationsTable.module.css';

export function ApplicationsTable({ applications }: { applications: Application[] }) {
  if (applications.length === 0) {
    return <p>No applications match these filters.</p>;
  }

  return (
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
        {applications.map((app, i) => (
          <tr key={app.id} className={i % 2 === 1 ? styles.altRow : undefined}>
            <td>
              <Link href={`/admin/applications/${app.id}`} className="mono">
                {app.referenceCode}
              </Link>
            </td>
            <td>{app.firstName} {app.lastName}</td>
            <td>
              <StatusChip status={app.status} kind="application" />
            </td>
            <td className="mono">R{app.totalAmount.toLocaleString('en-ZA')}</td>
            <td>{new Date(app.createdAt).toLocaleDateString('en-ZA')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
