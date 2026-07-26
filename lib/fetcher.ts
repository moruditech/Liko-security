import type { ApiErrorEnvelope, ApiSuccessEnvelope } from '@/types/api';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api/v1';

/**
 * Thrown for every non-network API failure. `.message` is ALWAYS the exact
 * `message` string the backend sent in {success:false, message, errors[]}.
 *
 * Non-negotiable project rule (see project memory): never construct a
 * message from res.status/res.statusText, never prefix/suffix it with a
 * status code, never fall back to a generic "Error 404"-style string when a
 * real backend message exists. Every catch site in the app must render
 * err.message as-is.
 */
export class ApiClientError extends Error {
  errors: { field: string; message: string }[];

  constructor(message: string, errors: { field: string; message: string }[] = []) {
    super(message);
    this.name = 'ApiClientError';
    this.errors = errors;
  }
}

/**
 * Thrown only when there is no response body to read a message from at all
 * (DNS failure, connection refused, request aborted, CORS block before any
 * response). This is the ONE place a hardcoded fallback string is allowed,  * it still must not contain a status code, because there isn't one to show.
 */
export class ApiNetworkError extends Error {
  constructor() {
    super("Couldn't connect. Check your internet connection and try again.");
    this.name = 'ApiNetworkError';
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | Record<string, unknown> | null;
  /** Set true for requests that must not trigger the refresh-and-retry flow (e.g. the refresh call itself). */
  skipAuthRetry?: boolean;
}

// Phase 2 wires this to AuthProvider: holds the in-memory access token getter/setter
// and the single-flight refresh promise so concurrent 401s queue behind one refresh call
// (TAD §5). Left as an injectable hook so this file doesn't have to change shape later.
type AuthHook = {
  getAccessToken: () => string | null;
  refresh: () => Promise<string | null>;
  onRefreshFailed: () => void;
};

let authHook: AuthHook | null = null;

export function registerAuthHook(hook: AuthHook) {
  authHook = hook;
}

async function parseEnvelope<T>(res: Response): Promise<ApiSuccessEnvelope<T> | ApiErrorEnvelope> {
  try {
    return await res.json();
  } catch {
    // Response had no parseable JSON body at all, treat as network-level failure,
    // not a backend-authored error, since there's no `message` to show.
    throw new ApiNetworkError();
  }
}

async function coreRequest<T>(path: string, options: RequestOptions = {}, isRetry = false): Promise<T> {
  const { body, skipAuthRetry, headers, ...rest } = options;

  const isFormData = body instanceof FormData;
  const finalHeaders: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...headers,
  };

  const token = authHook?.getAccessToken();
  if (token) {
    (finalHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: finalHeaders,
      credentials: 'include', // refresh cookie, scoped to /api/v1/auth per TAD §5
      body: isFormData || body == null ? (body as BodyInit | null | undefined) : JSON.stringify(body),
    });
  } catch {
    // fetch() itself threw: no connection, DNS failure, aborted request.
    throw new ApiNetworkError();
  }

  // Mid-session 401: refresh once, retry original request once. Per TAD §5,
  // concurrent requests during an in-flight refresh must queue behind the
  // single refresh call, that queueing lives in the AuthProvider-owned
  // `refresh()` implementation (Phase 2), not duplicated here.
  if (res.status === 401 && !skipAuthRetry && !isRetry && authHook) {
    const newToken = await authHook.refresh();
    if (newToken) {
      return coreRequest<T>(path, options, true);
    }
    authHook.onRefreshFailed();
  }

  const envelope = await parseEnvelope<T>(res);

  if (!envelope.success) {
    throw new ApiClientError(envelope.message, envelope.errors ?? []);
  }

  return envelope.data;
}

export const fetcher = {
  get: <T>(path: string, options?: RequestOptions) => coreRequest<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: RequestOptions['body'], options?: RequestOptions) =>
    coreRequest<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: RequestOptions['body'], options?: RequestOptions) =>
    coreRequest<T>(path, { ...options, method: 'PATCH', body }),
  put: <T>(path: string, body?: RequestOptions['body'], options?: RequestOptions) =>
    coreRequest<T>(path, { ...options, method: 'PUT', body }),
  delete: <T>(path: string, options?: RequestOptions) => coreRequest<T>(path, { ...options, method: 'DELETE' }),
};
