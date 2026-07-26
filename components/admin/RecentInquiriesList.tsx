import Link from 'next/link';
import type { Inquiry } from '@/types/api';
import { StatusChip } from './StatusChip';
import styles from './RecentApplicationsList.module.css';

export function RecentInquiriesList({ inquiries }: { inquiries: Inquiry[] }) {
  if (inquiries.length === 0) return <p>No inquiries yet.</p>;

  return (
    <ul className={styles.list}>
      {inquiries.map((inquiry) => (
        <li key={inquiry.id}>
          <Link href={`/admin/inquiries/${inquiry.id}`}>
            <span>{inquiry.name}</span>
            <StatusChip status={inquiry.status} kind="inquiry" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
