'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { registerAuthHook } from '@/lib/fetcher';
import type { AuthUser, Permission } from '@/types/api';

type AuthStatus = 'verifying' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  pendingMfaToken: string | null;
  hasPermission: (permission: Permission) => boolean;
  login: (email: string, password: string) => Promise<{ mfaRequired: boolean }>;
  verifyMfa: (code: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Key used to persist the refresh token across page reloads. The value is
// opaque (a signed JWT) and HttpOnly on the backend, but since the frontend
// and backend are on different subdomains, cross-origin cookies cannot be
// relied upon. Storing the token in localStorage and sending it in the
// request body is the correct pattern for this deployment topology.
const RT_KEY = 'liko_rt';

function saveRefreshToken(token: string) {
  try { localStorage.setItem(RT_KEY, token); } catch { /* storage unavailable */ }
}

function loadRefreshToken(): string | null {
  try { return localStorage.getItem(RT_KEY); } catch { return null; }
}

function clearRefreshToken() {
  try { localStorage.removeItem(RT_KEY); } catch { /* storage unavailable */ }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const needsAuth = pathname?.startsWith('/admin') || pathname?.startsWith('/login');
  const [status, setStatus] = useState<AuthStatus>(needsAuth ? 'verifying' : 'unauthenticated');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [pendingMfaToken, setPendingMfaToken] = useState<string | null>(null);

  const accessTokenRef = useRef<string | null>(null);
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);

  const clearSession = useCallback(() => {
    accessTokenRef.current = null;
    clearRefreshToken();
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const doRefresh = useCallback(async (): Promise<string | null> => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const promise = (async () => {
      try {
        const storedToken = loadRefreshToken();
        const result = await authApi.refresh(storedToken ?? undefined);
        accessTokenRef.current = result.accessToken;
        if (result.user) setUser(result.user);
        return result.accessToken;
      } catch {
        return null;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();

    refreshPromiseRef.current = promise;
    return promise;
  }, []);

  useEffect(() => {
    registerAuthHook({
      getAccessToken: () => accessTokenRef.current,
      refresh: doRefresh,
      onRefreshFailed: () => {
        clearSession();
        router.push('/login');
      },
    });
  }, [doRefresh, clearSession, router]);

  useEffect(() => {
    if (!needsAuth) {
      setStatus('unauthenticated');
      return;
    }

    let cancelled = false;

    (async () => {
      const token = await doRefresh();
      if (cancelled) return;
      setStatus(token ? 'authenticated' : 'unauthenticated');
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsAuth]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login(email, password);
    if (result.mfaRequired) {
      setPendingMfaToken(result.mfaToken ?? null);
      return { mfaRequired: true };
    }
    accessTokenRef.current = result.accessToken ?? null;
    if (result.refreshToken) saveRefreshToken(result.refreshToken);
    setUser(result.user ?? null);
    setStatus('authenticated');
    return { mfaRequired: false };
  }, []);

  const verifyMfa = useCallback(
    async (code: string) => {
      if (!pendingMfaToken) {
        throw new Error('No pending MFA session.');
      }
      const result = await authApi.verifyMfa(code, pendingMfaToken);
      accessTokenRef.current = result.accessToken ?? null;
      if (result.refreshToken) saveRefreshToken(result.refreshToken);
      setUser(result.user ?? null);
      setStatus('authenticated');
      setPendingMfaToken(null);
    },
    [pendingMfaToken]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearSession();
      router.push('/login');
    }
  }, [clearSession, router]);

  const hasPermission = useCallback(
    (permission: Permission) => user?.permissions.includes(permission) ?? false,
    [user]
  );

  return (
    <AuthContext.Provider value={{ status, user, pendingMfaToken, hasPermission, login, verifyMfa, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
