import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthProvider, useAuth, getAuthClearFn } from '@/contexts/AuthContext';

// Mock the API module so login/logout don't hit the network
vi.mock('@/services/api', () => ({
  login: vi.fn(async (username: string) => ({
    token: 'session',
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
    user: { name: 'Test User', email: username },
  })),
  logout: vi.fn(async () => undefined),
}));

const AUTH_USER_KEY = 'auth-user';

function TestConsumer() {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.email : 'null'}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <button onClick={() => login('admin@example.com', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides default unauthenticated state', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  it('restores user from localStorage on mount', () => {
    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify({ name: 'Stored', email: 'stored@example.com' })
    );

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('stored@example.com');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
  });

  it('stores user in memory and localStorage on login', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('admin@example.com');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    expect(localStorage.getItem(AUTH_USER_KEY)).not.toBeNull();
  });

  it('clears user from memory and localStorage on logout', async () => {
    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify({ name: 'Stored', email: 'stored@example.com' })
    );

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(localStorage.getItem(AUTH_USER_KEY)).toBeNull();
  });

  it('exposes clearAuth function for external use (401 interceptor)', async () => {
    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify({ name: 'Stored', email: 'stored@example.com' })
    );

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');

    const clearFn = getAuthClearFn();
    expect(clearFn).not.toBeNull();

    await act(async () => {
      clearFn!();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(localStorage.getItem(AUTH_USER_KEY)).toBeNull();
  });

  it('throws error when useAuth is used outside AuthProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );

    spy.mockRestore();
  });

  it('isAuthenticated is derived from user being non-null', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');

    await act(async () => {
      screen.getByText('Login').click();
    });
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');

    await act(async () => {
      screen.getByText('Logout').click();
    });
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });
});
