'use client';

import { useMemo } from 'react';
import { validateIdNumber } from '@/lib/validation/idNumber';
import type { IdType } from '@/types/api';
import styles from './IdNumberField.module.css';

interface IdNumberFieldProps {
  idType: IdType;
  idNumber: string;
  onIdTypeChange: (idType: IdType) => void;
  onIdNumberChange: (idNumber: string) => void;
  /** Server-side field error from a prior failed submit, per errors[]. Shown alongside the client pre-check. */
  serverError?: string;
}

export function IdNumberField({ idType, idNumber, onIdTypeChange, onIdNumberChange, serverError }: IdNumberFieldProps) {
  // Client pre-check only. The server always re-validates (application.validation.js)
  // and is authoritative, this exists to catch typos before a round trip, not to
  // replace server validation.
  const clientCheck = useMemo(() => (idNumber ? validateIdNumber(idType, idNumber) : null), [idType, idNumber]);

  return (
    <div className={styles.field}>
      <div className={styles.toggle} role="radiogroup" aria-label="ID type">
        <label>
          <input type="radio" checked={idType === 'sa_id'} onChange={() => onIdTypeChange('sa_id')} />
          SA ID
        </label>
        <label>
          <input type="radio" checked={idType === 'passport'} onChange={() => onIdTypeChange('passport')} />
          Passport
        </label>
      </div>

      <label htmlFor="idNumber">{idType === 'sa_id' ? 'ID number' : 'Passport number'}</label>
      <input
        id="idNumber"
        value={idNumber}
        onChange={(e) => onIdNumberChange(e.target.value)}
        required
        inputMode={idType === 'sa_id' ? 'numeric' : 'text'}
      />

      {serverError && <p className={styles.error}>{serverError}</p>}
      {!serverError && clientCheck && !clientCheck.valid && <p className={styles.error}>{clientCheck.message}</p>}
    </div>
  );
}
