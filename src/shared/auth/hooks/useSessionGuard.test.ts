import { renderHook, waitFor } from '@shared/test/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { supabase } from '@shared/lib/supabase';
import { registerSession } from '../sessionService';
import { takeRevokedSessionNotice } from '../utils/revokedNotice';
import { useSessionGuard } from './useSessionGuard';

vi.mock('@shared/lib/supabase', () => ({ supabase: { auth: { signOut: vi.fn() } } }));
vi.mock('../sessionService', () => ({ registerSession: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
});

describe('useSessionGuard', () => {
  it('registers the session of a signed-in user', async () => {
    vi.mocked(registerSession).mockResolvedValue('active');
    renderHook(() => useSessionGuard('user-ana'));

    await waitFor(() => expect(registerSession).toHaveBeenCalled());
    expect(supabase.auth.signOut).not.toHaveBeenCalled();
  });

  it('signs this device out, locally, when another login revoked it', async () => {
    vi.mocked(registerSession).mockResolvedValue('revoked');
    renderHook(() => useSessionGuard('user-ana'));

    await waitFor(() => expect(supabase.auth.signOut).toHaveBeenCalledWith({ scope: 'local' }));
    expect(takeRevokedSessionNotice()).toBe(true);
  });

  it('checks again when the tab becomes visible', async () => {
    vi.mocked(registerSession).mockResolvedValue('active');
    renderHook(() => useSessionGuard('user-ana'));
    await waitFor(() => expect(registerSession).toHaveBeenCalledTimes(1));

    window.dispatchEvent(new Event('focus'));

    await waitFor(() => expect(registerSession).toHaveBeenCalledTimes(2));
  });

  it('does nothing while signed out', () => {
    renderHook(() => useSessionGuard(null));
    expect(registerSession).not.toHaveBeenCalled();
  });
});
