import { fetcher } from '@/lib/fetcher';
import type { Invoice } from '@/types/api';

export const invoicesApi = {
  // GET /invoices/:applicationId, requires invoices:issue OR applications:read
  // (confirmed in invoice.routes.js, broader gate than a single permission).
  listForApplication: (applicationId: string) => fetcher.get<Invoice[]>(`/invoices/${applicationId}`),

  resend: (invoiceId: string) => fetcher.post<void>(`/invoices/${invoiceId}/resend`),
};
