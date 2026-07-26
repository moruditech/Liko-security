import { fetcher } from '@/lib/fetcher';
import type { LoginResponse } from '@/types/api';

export const authApi = {
  login: (email: string, password: string) =>
    fetcher.post<LoginResponse>('/auth/login', { email, password }, { skipAuthRetry: true }),

  // mfaToken is sent as the Bearer token, not in the body, matches
  // requireMfaPendingSession in mfaSession.middleware.js.
  verifyMfa: (code: string, mfaToken: string) =>
    fetcher.post<LoginResponse>(
      '/auth/mfa/verify',
      { code },
      { skipAuthRetry: true, headers: { Authorization: `Bearer ${mfaToken}` } }
    ),

  refresh: () => fetcher.post<{ accessToken: string; user: LoginResponse['user'] }>('/auth/refresh', undefined, {
    skipAuthRetry: true,
  }),

  logout: () => fetcher.post<void>('/auth/logout', undefined, { skipAuthRetry: true }),

  forgotPassword: (email: string) =>
    fetcher.post<void>('/auth/forgot-password', { email }, { skipAuthRetry: true }),

  resetPassword: (token: string, password: string) =>
    fetcher.post<void>('/auth/reset-password', { token, password }, { skipAuthRetry: true }),
};
