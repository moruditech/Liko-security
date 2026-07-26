'use client';

import Link from 'next/link';
import type { Inquiry } from '@/types/api';
import { StatusChip } from './StatusChip';
import styles from './ApplicationsTable.module.css';

interface InquiryListProps {
  inquiries: Inquiry[];
  statusFilter: 'open' | 'replied' | '';
  onStatusFilterChange: (status: 'open' | 'replied' | '') => void;
}

export function InquiryList({ inquiries, statusFilter, onStatusFilterChange }: InquiryListProps) {
  return (
    <div>
      <select value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value as 'open' | 'replied' | '')}>
        <option value="">All</option>
        <option value="open">Open</option>
        <option value="replied">Replied</option>
      </select>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry, i) => (
            <tr key={inquiry.id} className={i % 2 === 1 ? styles.altRow : undefined}>
              <td>
                <Link href={`/admin/inquiries/${inquiry.id}`}>{inquiry.name}</Link>
              </td>
              <td>{inquiry.email}</td>
              <td>
                <StatusChip status={inquiry.status} kind="inquiry" />
              </td>
              <td>{new Date(inquiry.createdAt).toLocaleDateString('en-ZA')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
