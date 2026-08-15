import { fetcher } from '@/lib/fetcher';
import type { LoginResponse } from '@/types/api';

export const authApi = {
  login: (email: string, password: string) =>
    fetcher.post<LoginResponse>('/auth/login', { email, password }, { skipAuthRetry: true }),

  verifyMfa: (code: string, mfaToken: string) =>
    fetcher.post<LoginResponse>(
      '/auth/mfa/verify',
      { code },
      { skipAuthRetry: true, headers: { Authorization: `Bearer ${mfaToken}` } }
    ),

  // refreshToken is passed in the body so the session survives page reloads
  // without relying on cross-origin cookies (frontend and backend are on
  // different Render subdomains). The backend accepts it via
  // req.body.refreshToken as its primary source, falling back to the cookie.
  refresh: (refreshToken?: string) =>
    fetcher.post<{ accessToken: string; user: LoginResponse['user'] }>(
      '/auth/refresh',
      refreshToken ? { refreshToken } : undefined,
      { skipAuthRetry: true }
    ),

  logout: () => fetcher.post<void>('/auth/logout', undefined, { skipAuthRetry: true }),

  forgotPassword: (email: string) =>
    fetcher.post<void>('/auth/forgot-password', { email }, { skipAuthRetry: true }),

  resetPassword: (token: string, password: string) =>
    fetcher.post<void>('/auth/reset-password', { token, password }, { skipAuthRetry: true }),
};
