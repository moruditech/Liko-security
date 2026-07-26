'use client';

import { useState } from 'react';
import { invoicesApi } from '@/lib/api/invoices';
import { PermissionGate } from './PermissionGate';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { Invoice } from '@/types/api';
import styles from './InvoiceList.module.css';

export function InvoiceList({ invoices }: { invoices: Invoice[] }) {
  const { showToast } = useToast();
  const [resendingId, setResendingId] = useState<string | null>(null);

  if (invoices.length === 0) {
    return <p>No invoices issued yet.</p>;
  }

  async function handleResend(invoiceId: string) {
    setResendingId(invoiceId);
    try {
      await invoicesApi.resend(invoiceId);
      showToast('Invoice resent.', 'success');
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) {
        showToast(err.message, 'error');
      }
    } finally {
      setResendingId(null);
    }
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Type</th>
          <th>Amount</th>
          <th>Issued</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {invoices.map((invoice) => (
          <tr key={invoice.id}>
            <td>{invoice.type === 'proforma' ? 'Proforma' : 'Official'}</td>
            <td className="mono">R{invoice.amount.toLocaleString('en-ZA')}</td>
            <td>{new Date(invoice.issuedAt).toLocaleDateString('en-ZA')}</td>
            <td>
              <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                View PDF
              </a>
              <PermissionGate permission="invoices:issue">
                <button
                  type="button"
                  onClick={() => handleResend(invoice.id)}
                  disabled={resendingId === invoice.id}
                >
                  {resendingId === invoice.id ? 'Resending...' : 'Resend'}
                </button>
              </PermissionGate>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
