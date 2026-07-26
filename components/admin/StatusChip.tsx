import styles from './StatusChip.module.css';

type ChipTone = 'navy' | 'gold' | 'grey' | 'red';

/**
 * DESIGN.md §5.3 originally specified only three chip tones (navy/gold/grey),
 * with no fourth tone for rejected applications, resolved by adding
 * --liko-error to the token system. "new" and "rejected" no longer share a
 * tone.
 */
const APPLICATION_STATUS_TONE: Record<string, ChipTone> = {
  new: 'grey',
  under_review: 'navy',
  payment_verified: 'gold',
  enrolled: 'navy',
  rejected: 'red',
};

const APPLICATION_STATUS_LABEL: Record<string, string> = {
  new: 'New',
  under_review: 'Under Review',
  payment_verified: 'Payment Verified',
  enrolled: 'Enrolled',
  rejected: 'Rejected',
};

const INQUIRY_STATUS_TONE: Record<string, ChipTone> = {
  open: 'gold',
  replied: 'navy',
};

interface StatusChipProps {
  status: string;
  kind?: 'application' | 'inquiry';
}

export function StatusChip({ status, kind = 'application' }: StatusChipProps) {
  const tone = kind === 'application' ? APPLICATION_STATUS_TONE[status] : INQUIRY_STATUS_TONE[status];
  const label = kind === 'application' ? APPLICATION_STATUS_LABEL[status] ?? status : status === 'open' ? 'Open' : 'Replied';

  return <span className={`${styles.chip} ${styles[tone ?? 'grey']}`}>{label}</span>;
}
