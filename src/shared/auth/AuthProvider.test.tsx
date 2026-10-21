import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@shared/test/test-utils';
import { AuthProvider } from './AuthProvider';
import { fetchProfile } from './authService';
import RequireAuth from './RequireAuth';
import type { Profile } from './types';
import { useAuth } from './useAuth';

type Listener = (event: AuthChangeEvent, session: Session | null) => void;

const { listeners } = vi.hoisted(() => ({ listeners: [] as Listener[] }));
vi.mock('@shared/lib/supabase', () => ({
  supabase: {
    auth: {
      onAuthStateChange: (listener: Listener) => {
        listeners.push(listener);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      },
    },
  },
}));
vi.mock('./authService', () => ({ fetchProfile: vi.fn() }));

const ana: Profile = { id: 'user-ana', name: 'Ana', role: 'estudante' };
const bia: Profile = { id: 'user-bia', name: 'Bia', role: 'estudante' };

/** Supabase announcing an auth event, then the profile request settling. */
const emit = async (event: AuthChangeEvent, userId: string | null) => {
  const session = userId ? ({ user: { id: userId } } as Session) : null;
  await act(async () => {
    listeners.forEach((listener) => listener(event, session));
    // The provider defers the profile request with setTimeout(0).
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

const Status = () => {
  const auth = useAuth();
  return <output>{auth.status === 'signedIn' ? auth.profile?.name : auth.status}</output>;
};

/** Stands in for a page with unsaved local state, like the piece being written. */
const Draft = () => {
  const [text, setText] = useState('');
  return <input aria-label="Rascunho" value={text} onChange={(e) => setText(e.target.value)} />;
};

const renderApp = () =>
  render(
    <AuthProvider>
      <Status />
      <Routes>
        <Route path="/entrar" element={<p>login page</p>} />
        <Route
          path="/trilhas"
          element={
            <RequireAuth>
              <Draft />
            </RequireAuth>
          }
        />
      </Routes>
    </AuthProvider>,
    { route: '/trilhas' },
  );

beforeEach(() => {
  listeners.length = 0;
  vi.mocked(fetchProfile).mockReset();
  vi.mocked(fetchProfile).mockImplementation(async (id) => (id === ana.id ? ana : bia));
});

describe('AuthProvider', () => {
  it('loads the profile of the user who signs in', async () => {
    renderApp();
    expect(screen.getByRole('status')).toHaveTextContent('loading');

    await emit('INITIAL_SESSION', ana.id);

    expect(await screen.findByText('Ana')).toBeInTheDocument();
    expect(fetchProfile).toHaveBeenCalledExactlyOnceWith(ana.id);
  });

  it('sends a visitor without a session to login', async () => {
    renderApp();

    await emit('INITIAL_SESSION', null);

    expect(screen.getByRole('status')).toHaveTextContent('signedOut');
    expect(screen.getByText('login page')).toBeInTheDocument();
    expect(fetchProfile).not.toHaveBeenCalled();
  });

  it('keeps the page and what was typed when Supabase re-announces the same user', async () => {
    // supabase-js emits SIGNED_IN again whenever the tab regains focus.
    const user = userEvent.setup();
    renderApp();
    await emit('INITIAL_SESSION', ana.id);
    await user.type(await screen.findByLabelText('Rascunho'), 'Excelentíssimo');

    await emit('SIGNED_IN', ana.id);
    await emit('USER_UPDATED', ana.id);

    expect(screen.getByRole('status')).toHaveTextContent('Ana');
    expect(screen.getByLabelText('Rascunho')).toHaveValue('Excelentíssimo');
    expect(fetchProfile).toHaveBeenCalledTimes(1);
  });

  it('starts over when a different user signs in', async () => {
    renderApp();
    await emit('INITIAL_SESSION', ana.id);
    await screen.findByText('Ana');

    await emit('SIGNED_IN', bia.id);

    expect(await screen.findByText('Bia')).toBeInTheDocument();
    expect(fetchProfile).toHaveBeenLastCalledWith(bia.id);
  });

  it('signs out, and loads the profile again on the next sign-in', async () => {
    renderApp();
    await emit('INITIAL_SESSION', ana.id);
    await screen.findByText('Ana');

    await emit('SIGNED_OUT', null);
    expect(screen.getByRole('status')).toHaveTextContent('signedOut');
    expect(screen.getByText('login page')).toBeInTheDocument();

    await emit('SIGNED_IN', ana.id);
    expect(await screen.findByText('Ana')).toBeInTheDocument();
    expect(fetchProfile).toHaveBeenCalledTimes(2);
  });
});
