import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthProvider, useAuth, getAuthClearFn } from '@/contexts/AuthContext';

const AUTH_TOKEN_KEY = 'auth-token';

function TestConsumer() {
  const { token, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="token">{token ?? 'null'}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <button onClick={() => login('user', 'pass')}>Login</button>
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

    expect(screen.getByTestId('token')).toHaveTextContent('null');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  it('restores token from localStorage on mount', () => {
    localStorage.setItem(AUTH_TOKEN_KEY, 'stored-token');

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('token')).toHaveTextContent('stored-token');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
  });

  it('stores token in memory and localStorage on login', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('token')).not.toHaveTextContent('null');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).not.toBeNull();
  });

  it('clears token from memory and localStorage on logout', async () => {
    localStorage.setItem(AUTH_TOKEN_KEY, 'stored-token');

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('token')).toHaveTextContent('null');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
  });

  it('exposes clearToken function for external use (401 interceptor)', async () => {
    localStorage.setItem(AUTH_TOKEN_KEY, 'stored-token');

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

    expect(screen.getByTestId('token')).toHaveTextContent('null');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
  });

  it('throws error when useAuth is used outside AuthProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );

    spy.mockRestore();
  });

  it('isAuthenticated is derived from token being non-null', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    // Initially no token
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');

    // After login, token exists
    await act(async () => {
      screen.getByText('Login').click();
    });
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');

    // After logout, token is null again
    await act(async () => {
      screen.getByText('Logout').click();
    });
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });
});
