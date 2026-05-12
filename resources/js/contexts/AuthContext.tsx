import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout } from '@/services/api';

const AUTH_USER_KEY = 'auth-user';

interface AuthUser {
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** @deprecated kept for backwards-compat with older components */
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Exposed for external code (axios 401 interceptor) to clear the local auth state
 * without making a network call.
 */
let clearAuthExternal: (() => void) | null = null;

export function getAuthClearFn(): (() => void) | null {
  return clearAuthExternal;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const clearAuth = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_USER_KEY);
    } catch {
      // ignore
    }
  }, []);

  // Expose clearAuth for the axios 401 interceptor
  useEffect(() => {
    clearAuthExternal = clearAuth;
    return () => {
      clearAuthExternal = null;
    };
  }, [clearAuth]);

  const login = useCallback(async (username: string, password: string): Promise<void> => {
    const response = await apiLogin(username, password);
    const nextUser: AuthUser = response.user ?? { name: username, email: username };
    setUser(nextUser);
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
    } catch {
      // localStorage unavailable — user stored in memory only
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await apiLogout();
    } catch {
      // even if logout request fails (e.g. network), clear local state
    }
    clearAuth();
  }, [clearAuth]);

  const isAuthenticated = user !== null;

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    token: isAuthenticated ? 'session' : null,
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
export type { AuthContextValue, AuthUser };
