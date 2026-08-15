import { fetcher } from '@/lib/fetcher';
import type { Application, ApplicationAddress, ApplicationStatus, ApplicationSubmitResponse, Paginated } from '@/types/api';

export interface ApplicationSubmitInput {
  firstName: string;
  lastName: string;
  idType: 'sa_id' | 'passport';
  idNumber: string;
  phone: string;
  whatsapp?: string;
  email: string;
  address: ApplicationAddress;
  coursesSelected: string[];
  preferredIntake: string;
  consentGiven: true;
  idDocument: File;
}

export const applicationsApi = {
  // POST /applications is multipart/form-data. The backend's
  // normalizeMultipartBody (application.controller.js) expects `address`
  // and `coursesSelected` as JSON-stringified strings inside the FormData,
  // not as native objects/arrays, confirmed by reading the controller.
  submit: (input: ApplicationSubmitInput) => {
    const form = new FormData();
    form.append('firstName', input.firstName);
    form.append('lastName', input.lastName);
    form.append('idType', input.idType);
    form.append('idNumber', input.idNumber);
    form.append('phone', input.phone);
    if (input.whatsapp) form.append('whatsapp', input.whatsapp);
    form.append('email', input.email);
    form.append('address', JSON.stringify(input.address));
    form.append('coursesSelected', JSON.stringify(input.coursesSelected));
    form.append('preferredIntake', input.preferredIntake);
    form.append('consentGiven', 'true');
    form.append('idDocument', input.idDocument);

    return fetcher.post<ApplicationSubmitResponse>('/applications', form);
  },

  // Admin
  list: (params: {
    status?: ApplicationStatus;
    courseId?: string;
    intakeId?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }) =>
    fetcher.get<Paginated<Application>>(
      `/applications?${new URLSearchParams(params as Record<string, string>)}`
    ),

  get: (id: string) => fetcher.get<Application>(`/applications/${id}`),

  getDocumentUrl: (id: string) => fetcher.get<{ url: string }>(`/applications/${id}/document`),

  updateStatus: (id: string, status: ApplicationStatus) =>
    fetcher.patch<Application>(`/applications/${id}/status`, { status }),

  sendEmail: (id: string, subject: string, body: string) =>
    fetcher.post<void>(`/applications/${id}/email`, { subject, body }),
};
