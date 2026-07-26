'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { applicationsApi } from '@/lib/api/applications';
import { invoicesApi } from '@/lib/api/invoices';
import { ApplicantProfileCard } from '@/components/admin/ApplicantProfileCard';
import { StatusStepper } from '@/components/admin/StatusStepper';
import { StatusChangeControl } from '@/components/admin/StatusChangeControl';
import { DocumentViewerButton } from '@/components/admin/DocumentViewerButton';
import { InvoiceList } from '@/components/admin/InvoiceList';
import { StatusHistoryTimeline } from '@/components/admin/StatusHistoryTimeline';
import { EmailComposerModal } from '@/components/admin/EmailComposerModal';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { useToast } from '@/lib/context/ToastContext';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import type { Application, ApplicationStatus, Invoice } from '@/types/api';
import styles from './page.module.css';

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [application, setApplication] = useState<Application | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  function load() {
    applicationsApi
      .get(params.id)
      .then(setApplication)
      .catch((err) => {
        if (err instanceof ApiClientError || err instanceof ApiNetworkError) showToast(err.message, 'error');
      });

    // TAD §12.3: GET /invoices/:applicationId requires invoices:issue OR
    // applications:read. If the session only has applications:read and the
    // backend still 403s for some other reason, this fails quietly into an
    // empty list rather than surfacing a toast on every page load, since an
    // application with no invoices yet is a completely normal state, not an error.
    invoicesApi
      .listForApplication(params.id)
      .then(setInvoices)
      .catch(() => setInvoices([]));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function handleStatusChange(status: ApplicationStatus) {
    if (!application) return;
    try {
      const updated = await applicationsApi.updateStatus(application.id, status);
      setApplication(updated);
      showToast('Status updated.', 'success');
    } catch (err) {
      if (err instanceof ApiClientError || err instanceof ApiNetworkError) {
        showToast(err.message, 'error');
      }
    }
  }

  if (!application) return <p>Loading...</p>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className="mono">{application.referenceCode}</h1>
        <PermissionGate permission="applications:write">
          <button type="button" onClick={() => setEmailModalOpen(true)} className={styles.emailButton}>
            Send email
          </button>
        </PermissionGate>
      </div>

      <StatusStepper status={application.status} />
      <StatusChangeControl currentStatus={application.status} onChange={handleStatusChange} />

      <div className={styles.grid}>
        <ApplicantProfileCard application={application} />

        <div className={styles.side}>
          <DocumentViewerButton applicationId={application.id} />

          <section>
            <h2>Invoices</h2>
            <InvoiceList invoices={invoices} />
          </section>

          <section>
            <h2>Status history</h2>
            <StatusHistoryTimeline history={application.statusHistory} />
          </section>
        </div>
      </div>

      <EmailComposerModal
        applicationId={application.id}
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
      />
    </div>
  );
}
