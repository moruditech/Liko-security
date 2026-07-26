import type { ApplicationStatus } from '@/types/api';

export const APPLICATION_STATUS_ORDER: ApplicationStatus[] = [
  'new',
  'under_review',
  'payment_verified',
  'enrolled',
];

/**
 * Ported from src/shared/constants/enums.js's status machine: linear
 * progression new -> under_review -> payment_verified -> enrolled, with
 * rejected reachable from any non-terminal status. enrolled and rejected
 * are terminal (no further transitions). This is a UI convenience only,
 * the backend's own status machine (enforced in application.controller.js /
 * permission.middleware.js) is authoritative regardless of what this offers.
 */
export function nextValidTransitions(current: ApplicationStatus): ApplicationStatus[] {
  const terminal: ApplicationStatus[] = ['enrolled', 'rejected'];
  if (terminal.includes(current)) return [];

  const currentIndex = APPLICATION_STATUS_ORDER.indexOf(current);
  const forward = APPLICATION_STATUS_ORDER[currentIndex + 1];

  return forward ? [forward, 'rejected'] : ['rejected'];
}
