import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { fetcher, ApiClientError, ApiNetworkError, registerAuthHook } from '@/lib/fetcher';

function mockResponse(body: unknown, init?: { status?: number; ok?: boolean }) {
  return {
    ok: init?.ok ?? true,
    status: init?.status ?? 200,
    json: async () => body,
  } as Response;
}

describe('fetcher', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Reset to a no-op auth hook between tests so 401 handling doesn't leak
    // state across tests that don't care about it.
    registerAuthHook({
      getAccessToken: () => null,
      refresh: async () => null,
      onRefreshFailed: () => {},
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns envelope.data on a successful response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(mockResponse({ success: true, data: { id: '1' }, message: 'ok' }))
    );

    const result = await fetcher.get<{ id: string }>('/things/1');
    expect(result).toEqual({ id: '1' });
  });

  it('throws ApiClientError with the backend message verbatim, never a status code, on {success:false}', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        mockResponse(
          { success: false, message: 'This reference code has already been used.', errors: [] },
          { ok: false, status: 409 }
        )
      )
    );

    await expect(fetcher.get('/applications/dup')).rejects.toMatchObject({
      message: 'This reference code has already been used.',
    });
  });

  it('preserves field-level errors[] alongside the general message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        mockResponse(
          {
            success: false,
            message: 'Validation failed.',
            errors: [{ field: 'email', message: 'Must be a valid email address.' }],
          },
          { ok: false, status: 400 }
        )
      )
    );

    try {
      await fetcher.post('/inquiries', { email: 'not-an-email' });
      throw new Error('expected fetcher.post to reject');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiClientError);
      expect((err as ApiClientError).message).toBe('Validation failed.');
      expect((err as ApiClientError).errors).toEqual([{ field: 'email', message: 'Must be a valid email address.' }]);
    }
  });

  it('throws ApiNetworkError with a fixed fallback, not a status code, when fetch itself rejects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(fetcher.get('/anything')).rejects.toBeInstanceOf(ApiNetworkError);
  });

  it('throws ApiNetworkError when the response has no parseable JSON body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => {
          throw new SyntaxError('Unexpected end of JSON input');
        },
      } as unknown as Response)
    );

    await expect(fetcher.get('/anything')).rejects.toBeInstanceOf(ApiNetworkError);
  });

  it('retries once after a successful refresh on a mid-session 401, then succeeds', async () => {
    const fetchMock = vi
      .fn()
      // First call: 401
      .mockResolvedValueOnce(mockResponse({ success: false, message: 'Session expired.', errors: [] }, { ok: false, status: 401 }))
      // Retried call after refresh: succeeds
      .mockResolvedValueOnce(mockResponse({ success: true, data: { id: '1' }, message: 'ok' }));
    vi.stubGlobal('fetch', fetchMock);

    const refresh = vi.fn().mockResolvedValue('new-access-token');
    registerAuthHook({ getAccessToken: () => 'stale-token', refresh, onRefreshFailed: vi.fn() });

    const result = await fetcher.get<{ id: string }>('/protected');

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ id: '1' });
  });

  it('calls onRefreshFailed and surfaces the 401 error when refresh itself fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(mockResponse({ success: false, message: 'Session expired.', errors: [] }, { ok: false, status: 401 }))
    );

    const onRefreshFailed = vi.fn();
    registerAuthHook({ getAccessToken: () => 'stale-token', refresh: async () => null, onRefreshFailed });

    await expect(fetcher.get('/protected')).rejects.toMatchObject({ message: 'Session expired.' });
    expect(onRefreshFailed).toHaveBeenCalledTimes(1);
  });

  it('does not attempt refresh at all when skipAuthRetry is set (e.g. the refresh call itself)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(mockResponse({ success: false, message: 'Invalid refresh token.', errors: [] }, { ok: false, status: 401 }))
    );

    const refresh = vi.fn();
    registerAuthHook({ getAccessToken: () => null, refresh, onRefreshFailed: vi.fn() });

    await expect(fetcher.post('/auth/refresh', undefined, { skipAuthRetry: true })).rejects.toMatchObject({
      message: 'Invalid refresh token.',
    });
    expect(refresh).not.toHaveBeenCalled();
  });
});
