'use client';

import { useState } from 'react';
import { applicationsApi } from '@/lib/api/applications';
import { ApiClientError, ApiNetworkError } from '@/lib/fetcher';
import { IdNumberField } from './IdNumberField';
import { CourseSelectionGrid } from './CourseSelectionGrid';
import { IntakeSelector } from './IntakeSelector';
import { FileUploadDropzone } from './FileUploadDropzone';
import { PopiaConsentCheckbox } from './PopiaConsentCheckbox';
import { ApplicationSuccessScreen } from './ApplicationSuccessScreen';
import type { Course, Intake } from '@/types/api';
import styles from './ApplicationForm.module.css';

interface ApplicationFormProps {
  courses: Course[];
  intakes: Intake[];
  psiraFee: number;
}

interface FormState {
  firstName: string;
  lastName: string;
  idType: 'sa_id' | 'passport';
  idNumber: string;
  phone: string;
  whatsapp: string;
  email: string;
  street: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  coursesSelected: string[];
  preferredIntake: string;
  consentGiven: boolean;
}

const INITIAL_STATE: FormState = {
  firstName: '',
  lastName: '',
  idType: 'sa_id',
  idNumber: '',
  phone: '',
  whatsapp: '',
  email: '',
  street: '',
  suburb: '',
  city: '',
  province: '',
  postalCode: '',
  coursesSelected: [],
  preferredIntake: '',
  consentGiven: false,
};

export function ApplicationForm({ courses, intakes, psiraFee }: ApplicationFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [idDocument, setIdDocument] = useState<File | null>(null);

  // Four distinct states per TAD §11.5, never collapsed into one generic "error" flag.
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [fileError, setFileError] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setFileError(null);
    setNetworkError(null);
    setGeneralError(null);

    if (!idDocument) {
      setFileError('Please attach your ID document before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await applicationsApi.submit({
        firstName: form.firstName,
        lastName: form.lastName,
        idType: form.idType,
        idNumber: form.idNumber,
        phone: form.phone,
        whatsapp: form.whatsapp || undefined,
        email: form.email,
        address: {
          street: form.street,
          suburb: form.suburb,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode,
        },
        coursesSelected: form.coursesSelected,
        preferredIntake: form.preferredIntake,
        consentGiven: true,
        idDocument,
      });
      setReferenceCode(result.referenceCode);
    } catch (err) {
      if (err instanceof ApiNetworkError) {
        setNetworkError(err.message);
      } else if (err instanceof ApiClientError) {
        // This also covers the public-submission rate limiter (max 10 per
        // window on POST /applications, confirmed in rateLimiter.middleware.js)
        // with no special-casing needed: it's just another {success:false,
        // message} response, so the backend's own message renders as-is,
        // never a 429 status code.
        if (err.errors.length > 0) {
          const byField: Record<string, string> = {};
          for (const fieldError of err.errors) {
            byField[fieldError.field] = fieldError.message;
          }
          setFieldErrors(byField);
        }
        // Always show the backend's own message too, verbatim, even when
        // field errors exist, some failures (e.g. a duplicate application)
        // aren't tied to one field.
        setGeneralError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (referenceCode) {
    return <ApplicationSuccessScreen referenceCode={referenceCode} />;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <section>
        <h2>Personal details</h2>

        <label htmlFor="firstName">First name</label>
        <input id="firstName" required value={form.firstName} onChange={(e) => update('firstName', e.target.value)} />
        {fieldErrors.firstName && <p className={styles.fieldError}>{fieldErrors.firstName}</p>}

        <label htmlFor="lastName">Last name</label>
        <input id="lastName" required value={form.lastName} onChange={(e) => update('lastName', e.target.value)} />
        {fieldErrors.lastName && <p className={styles.fieldError}>{fieldErrors.lastName}</p>}

        <IdNumberField
          idType={form.idType}
          idNumber={form.idNumber}
          onIdTypeChange={(t) => update('idType', t)}
          onIdNumberChange={(v) => update('idNumber', v)}
          serverError={fieldErrors.idNumber}
        />

        <label htmlFor="phone">Phone</label>
        <input id="phone" type="tel" required value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        {fieldErrors.phone && <p className={styles.fieldError}>{fieldErrors.phone}</p>}

        <label htmlFor="whatsapp">WhatsApp (if different from phone)</label>
        <input id="whatsapp" type="tel" value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
        {fieldErrors.email && <p className={styles.fieldError}>{fieldErrors.email}</p>}

        <label htmlFor="street">Address</label>
        <input
          id="street"
          required
          placeholder="Street address"
          value={form.street}
          onChange={(e) => update('street', e.target.value)}
        />
        <input
          placeholder="Suburb (optional)"
          value={form.suburb}
          onChange={(e) => update('suburb', e.target.value)}
        />
        <input placeholder="City" required value={form.city} onChange={(e) => update('city', e.target.value)} />
        <input
          placeholder="Province"
          required
          value={form.province}
          onChange={(e) => update('province', e.target.value)}
        />
        <input
          placeholder="Postal code"
          required
          value={form.postalCode}
          onChange={(e) => update('postalCode', e.target.value)}
        />
      </section>

      <section>
        <h2>Course selection</h2>
        <CourseSelectionGrid
          courses={courses}
          selected={form.coursesSelected}
          onChange={(selected) => update('coursesSelected', selected)}
          psiraFee={psiraFee}
        />
        {fieldErrors.coursesSelected && <p className={styles.fieldError}>{fieldErrors.coursesSelected}</p>}
      </section>

      <section>
        <h2>Intake</h2>
        <IntakeSelector
          intakes={intakes}
          courses={courses}
          value={form.preferredIntake}
          onChange={(v) => update('preferredIntake', v)}
        />
        {fieldErrors.preferredIntake && <p className={styles.fieldError}>{fieldErrors.preferredIntake}</p>}
      </section>

      <section>
        <h2>ID document</h2>
        <FileUploadDropzone file={idDocument} onChange={setIdDocument} />
        {/* Distinct file-error state, shown here even though FileUploadDropzone
            has its own inline pre-check message, for the case of "no file attached
            at all" caught at submit time. */}
        {fileError && <p className={styles.fieldError}>{fileError}</p>}
      </section>

      <PopiaConsentCheckbox checked={form.consentGiven} onChange={(v) => update('consentGiven', v)} />

      {/* Network error: no response body at all, one fixed fallback string, never a status code. */}
      {networkError && (
        <p className={styles.generalError} role="alert">
          {networkError}
        </p>
      )}

      {/* General backend-authored error: shown verbatim, never a status code. */}
      {generalError && (
        <p className={styles.generalError} role="alert">
          {generalError}
        </p>
      )}

      <button type="submit" disabled={submitting || !form.consentGiven}>
        {submitting ? 'Submitting...' : 'Submit application'}
      </button>
    </form>
  );
}
