import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { LoginResponse } from '@/types/api';

const AUTH_TOKEN_KEY = 'auth-token';

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Clears the auth token from both memory and localStorage.
 * Exposed for external use (e.g., axios 401 interceptor).
 */
let clearTokenExternal: (() => void) | null = null;

export function getAuthClearFn(): (() => void) | null {
  return clearTokenExternal;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const logout = useCallback(() => {
    setToken(null);
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {
      // localStorage unavailable — token already cleared from memory
    }
  }, []);

  // Expose the logout function for external code (e.g., axios interceptors)
  useEffect(() => {
    clearTokenExternal = logout;
    return () => {
      clearTokenExternal = null;
    };
  }, [logout]);

  const login = useCallback(async (username: string, password: string): Promise<void> => {
    // TODO: Wire to actual API call once the API service layer is ready
    // For now, simulate storing a token. The real implementation will call:
    // const response = await apiClient.login(username, password);
    // and use response.token
    void username;
    void password;

    // Placeholder: in the real implementation, this will be replaced with an API call
    const response: LoginResponse = {
      token: 'placeholder-token',
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    };

    setToken(response.token);
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    } catch {
      // localStorage unavailable — token stored in memory only
    }
  }, []);

  const isAuthenticated = token !== null;

  const value: AuthContextValue = {
    token,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext };
export type { AuthContextValue };
