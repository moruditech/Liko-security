import Link from 'next/link';
import type { Application } from '@/types/api';
import { StatusChip } from './StatusChip';
import styles from './RecentApplicationsList.module.css';

export function RecentApplicationsList({ applications }: { applications: Application[] }) {
  if (applications.length === 0) return <p>No applications yet.</p>;

  return (
    <ul className={styles.list}>
      {applications.map((app) => (
        <li key={app.id}>
          <Link href={`/admin/applications/${app.id}`}>
            <span className="mono">{app.referenceCode}</span>
            <span>{app.fullName}</span>
            <StatusChip status={app.status} kind="application" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
