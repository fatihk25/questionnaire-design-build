import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

const STORAGE_KEY = 'theme-preference';

interface ThemeContextValue {
  isDark: boolean;
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getStoredPreference(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
  } catch {
    // localStorage unavailable — fall through to default
  }
  return false; // default to light mode
}

function applyDarkClass(isDark: boolean): void {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const preference = getStoredPreference();
    applyDarkClass(preference);
    return preference;
  });

  useEffect(() => {
    applyDarkClass(isDark);
  }, [isDark]);

  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
      } catch {
        // localStorage unavailable — preference won't persist
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { ThemeContext };
