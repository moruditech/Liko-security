'use client';

import Link from 'next/link';
import type { Inquiry } from '@/types/api';
import { StatusChip } from './StatusChip';
import styles from './InquiryList.module.css';

interface InquiryListProps {
  inquiries: Inquiry[];
  statusFilter: 'open' | 'replied' | '';
  onStatusFilterChange: (status: 'open' | 'replied' | '') => void;
}

export function InquiryList({ inquiries, statusFilter, onStatusFilterChange }: InquiryListProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.filterBar}>
        <div className={styles.field}>
          <label htmlFor="inquiryStatusFilter">Status</label>
          <div className={styles.selectWrap}>
            <select
              id="inquiryStatusFilter"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as 'open' | 'replied' | '')}
            >
              <option value="">All</option>
              <option value="open">Open</option>
              <option value="replied">Replied</option>
            </select>
            <ChevronIcon />
          </div>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className={styles.card}>
          <p className={styles.empty}>No inquiries match this filter.</p>
        </div>
      ) : (
        <div className={styles.card}>
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
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td>
                    <Link href={`/admin/inquiries/${inquiry.id}`} className={styles.nameLink}>
                      {inquiry.name}
                    </Link>
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
      )}
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
