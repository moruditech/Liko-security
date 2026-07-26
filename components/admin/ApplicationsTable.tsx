import Link from 'next/link';
import type { Application } from '@/types/api';
import { StatusChip } from './StatusChip';
import styles from './ApplicationsTable.module.css';

function totalFor(app: Application): number {
  // No stored amount field on the Application model (confirmed, none exists).
  // coursesSelected arrives populated with {grade, title, fee} on list/detail
  // responses (application.service.js), so the total is computed client-side
  // from those populated fees. This does NOT include the PSIRA registration
  // fee, since /applications (list) doesn't return settings and adding a
  // settings fetch per row would be wasteful — flagged as a known
  // under-statement of the true total, course fees only.
  return app.coursesSelected.reduce((sum, c) => sum + c.fee, 0);
}

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
            <td>{app.fullName}</td>
            <td>
              <StatusChip status={app.status} kind="application" />
            </td>
            <td className="mono">R{totalFor(app).toLocaleString('en-ZA')}</td>
            <td>{new Date(app.createdAt).toLocaleDateString('en-ZA')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
