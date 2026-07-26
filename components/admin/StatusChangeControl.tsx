'use client';

import { useState } from 'react';
import { usePermission } from '@/lib/auth/usePermission';
import { nextValidTransitions } from '@/lib/constants/applicationStatus';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { ApplicationStatus } from '@/types/api';
import styles from './StatusChangeControl.module.css';

interface StatusChangeControlProps {
  currentStatus: ApplicationStatus;
  onChange: (status: ApplicationStatus) => void;
}

export function StatusChangeControl({ currentStatus, onChange }: StatusChangeControlProps) {
  const canWrite = usePermission('applications:write');
  const canIssueInvoices = usePermission('invoices:issue');
  const [pending, setPending] = useState<ApplicationStatus | null>(null);

  const transitions = nextValidTransitions(currentStatus);
  if (transitions.length === 0) return null;

  function isAllowed(target: ApplicationStatus) {
    // TAD §12.3 / confirmed in application.controller.js: applications:write
    // covers most transitions, but invoices:issue specifically gates the
    // payment_verified transition, on top of (not instead of) applications:write.
    if (target === 'payment_verified') return canWrite && canIssueInvoices;
    return canWrite;
  }

  return (
    <div className={styles.controls}>
      {transitions.map((target) =>
        isAllowed(target) ? (
          <button
            key={target}
            type="button"
            className={target === 'rejected' ? styles.reject : styles.advance}
            onClick={() => setPending(target)}
          >
            {target === 'rejected' ? 'Reject' : `Move to ${target.replace('_', ' ')}`}
          </button>
        ) : null
      )}

      <ConfirmDialog
        open={pending !== null}
        title={`Change status to "${pending?.replace('_', ' ')}"?`}
        description="The applicant's status history will record this change."
        confirmLabel="Confirm"
        destructive={pending === 'rejected'}
        onConfirm={() => {
          if (pending) onChange(pending);
          setPending(null);
        }}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
