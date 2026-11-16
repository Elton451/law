import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateProfile } from './updateProfile';

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock('@shared/lib/supabase', () => ({ supabase: { rpc } }));

const OFFER = '6f1c1a52-3f0e-4b8a-9d7e-2c1b0a9e8d7c';
const values = { name: 'Ana Souza', uf: 'SP' as const, offerId: OFFER };

beforeEach(() => vi.clearAllMocks());

describe('updateProfile', () => {
  it('calls update_profile with the validated fields', async () => {
    rpc.mockResolvedValue({ error: null });

    expect(await updateProfile(values)).toBeUndefined();
    expect(rpc).toHaveBeenCalledWith('update_profile', {
      p_name: 'Ana Souza',
      p_uf: 'SP',
      p_offer_id: OFFER,
    });
  });

  it('points a closed offer to the offer field', async () => {
    rpc.mockResolvedValue({ error: { message: 'invalid offer' } });
    expect((await updateProfile(values))?.field).toBe('offerId');
  });

  it('reports other failures above the form', async () => {
    rpc.mockResolvedValue({ error: { message: 'boom' } });
    expect(await updateProfile(values)).toEqual({ message: expect.any(String) });
  });
});
