'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { applicationsApi } from '@/lib/api/applications';
import { invoicesApi } from '@/lib/api/invoices';
import { ApplicantProfileCard } from '@/components/admin/ApplicantProfileCard';
import { ApplicationStatsRow } from '@/components/admin/ApplicationStatsRow';
import { SectionCard } from '@/components/admin/SectionCard';
import { StatusChip } from '@/components/admin/StatusChip';
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

  if (!application) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.page}>
      <Link href="/admin/applications" className={styles.backLink}>
        <BackIcon />
        Back to Applications
      </Link>

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerTop}>
            <h1 className={`mono ${styles.reference}`}>{application.referenceCode}</h1>
            <StatusChip status={application.status} kind="application" />
          </div>
          <p className={styles.applicantName}>
            {application.firstName} {application.lastName}
          </p>
        </div>

        <div className={styles.headerActions}>
          <DocumentViewerButton applicationId={application.id} />
          <PermissionGate permission="applications:write">
            <button type="button" onClick={() => setEmailModalOpen(true)} className={styles.emailButton}>
              Send email
            </button>
          </PermissionGate>
        </div>
      </div>

      <ApplicationStatsRow application={application} invoices={invoices} />

      <div className={styles.progressCard}>
        <StatusStepper status={application.status} />
        <StatusChangeControl currentStatus={application.status} onChange={handleStatusChange} />
      </div>

      <div className={styles.grid}>
        <SectionCard icon={<PersonIcon />} accent="navy" title="Applicant details">
          <ApplicantProfileCard application={application} />
        </SectionCard>

        <div className={styles.side}>
          <SectionCard icon={<ReceiptIcon />} accent="gold" title="Invoices">
            <InvoiceList invoices={invoices} />
          </SectionCard>

          <SectionCard icon={<HistoryIcon />} accent="mixed" title="Status history">
            <StatusHistoryTimeline history={application.statusHistory} />
          </SectionCard>
        </div>
      </div>

      <EmailComposerModal
        applicationId={application.id}
        recipientName={`${application.firstName} ${application.lastName}`}
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
      />
    </div>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2z" />
      <path d="M9 8h6M9 12h6" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}
