import { Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@shared/test/test-utils';
import RedirectIfAuthenticated from './RedirectIfAuthenticated';
import RequireAuth from './RequireAuth';
import type { AuthState } from '../types';
import { useAuth } from '../hooks/useAuth';

vi.mock('../hooks/useAuth', () => ({ useAuth: vi.fn() }));

const setAuth = (state: AuthState) => vi.mocked(useAuth).mockReturnValue(state);
const student: AuthState = {
  status: 'signedIn',
  userId: '1',
  email: 'ana@example.com',
  profile: { id: '1', name: 'Ana', role: 'estudante', uf: 'SP', offerId: 'offer-civil' },
};
const admin: AuthState = {
  status: 'signedIn',
  userId: '2',
  email: 'admin@example.com',
  profile: { id: '2', name: 'Admin', role: 'admin', uf: null, offerId: null },
};
// Signed in with Google, before completing the profile (SB03).
const googleStudent: AuthState = {
  status: 'signedIn',
  userId: '3',
  email: 'bia@example.com',
  profile: { id: '3', name: 'Bia', role: 'estudante', uf: null, offerId: null },
};

const renderApp = (options: Parameters<typeof render>[1]) =>
  render(
    <Routes>
      <Route
        path="/entrar"
        element={
          <RedirectIfAuthenticated>
            <p>login page</p>
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/trilhas"
        element={
          <RequireAuth>
            <p>trails page</p>
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAuth role="admin">
            <p>admin page</p>
          </RequireAuth>
        }
      />
      <Route
        path="/participante"
        element={
          <RequireAuth>
            <p>dashboard page</p>
          </RequireAuth>
        }
      />
      <Route
        path="/completar-cadastro"
        element={
          <RequireAuth allowIncompleteProfile>
            <p>complete profile page</p>
          </RequireAuth>
        }
      />
    </Routes>,
    options,
  );

beforeEach(() => vi.mocked(useAuth).mockReset());

describe('RequireAuth', () => {
  it('sends signed-out users to login', () => {
    setAuth({ status: 'signedOut' });
    renderApp({ route: '/trilhas' });
    expect(screen.getByText('login page')).toBeInTheDocument();
  });

  it('denies students access to admin routes', () => {
    setAuth(student);
    renderApp({ route: '/admin' });
    expect(screen.getByText('Acesso negado')).toBeInTheDocument();
  });

  it('lets admins into admin routes', () => {
    setAuth(admin);
    renderApp({ route: '/admin' });
    expect(screen.getByText('admin page')).toBeInTheDocument();
  });

  it('sends a participant with an incomplete profile to complete it first', () => {
    setAuth(googleStudent);
    renderApp({ route: '/trilhas' });
    expect(screen.getByText('complete profile page')).toBeInTheDocument();
  });

  it('lets an incomplete profile reach the completion page', () => {
    setAuth(googleStudent);
    renderApp({ route: '/completar-cadastro' });
    expect(screen.getByText('complete profile page')).toBeInTheDocument();
  });
});

describe('RedirectIfAuthenticated', () => {
  it('shows the page to signed-out users', () => {
    setAuth({ status: 'signedOut' });
    renderApp({ route: '/entrar' });
    expect(screen.getByText('login page')).toBeInTheDocument();
  });

  it('sends students to the dashboard', () => {
    setAuth(student);
    renderApp({ route: '/entrar' });
    expect(screen.getByText('dashboard page')).toBeInTheDocument();
  });

  it('sends an incomplete profile to the completion page', () => {
    setAuth(googleStudent);
    renderApp({ route: '/entrar' });
    expect(screen.getByText('complete profile page')).toBeInTheDocument();
  });

  it('sends admins to the admin panel', () => {
    setAuth(admin);
    renderApp({ route: '/entrar' });
    expect(screen.getByText('admin page')).toBeInTheDocument();
  });

  it('returns users to the page they originally asked for', () => {
    setAuth(admin);
    renderApp({ route: { pathname: '/entrar', state: { from: '/trilhas' } } });
    expect(screen.getByText('trails page')).toBeInTheDocument();
  });

  it.each(['//evil.com', '/\\evil.com', 'https://evil.com'])(
    'ignores an external "from" (%s)',
    (from) => {
      setAuth(student);
      renderApp({ route: { pathname: '/entrar', state: { from } } });
      expect(screen.getByText('dashboard page')).toBeInTheDocument();
    },
  );
});
