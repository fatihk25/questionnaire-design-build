import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { id as idTranslations, en as enTranslations } from '@/i18n';
import type { TranslationKeys } from '@/i18n';

/**
 * Supported locale types.
 */
export type Locale = 'id' | 'en';

/**
 * I18n context value interface.
 */
export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = 'locale-preference';
const DEFAULT_LOCALE: Locale = 'id';

const dictionaries: Record<Locale, TranslationKeys> = {
  id: idTranslations,
  en: enTranslations,
};

/**
 * Read the stored locale preference from localStorage.
 * Returns the default locale ('id') if no valid preference is stored.
 */
function getStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'id' || stored === 'en') {
      return stored;
    }
  } catch {
    // localStorage may be unavailable (e.g., SSR or privacy mode)
  }
  return DEFAULT_LOCALE;
}

/**
 * Persist locale preference to localStorage.
 */
function persistLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export const I18nContext = createContext<I18nContextValue | null>(null);

export interface I18nProviderProps {
  children: ReactNode;
}

/**
 * I18nProvider — provides locale state and translation function to the component tree.
 *
 * - Defaults to Indonesian ('id') when no preference is stored.
 * - Persists language preference to localStorage under 'locale-preference'.
 * - Re-renders all consumers on locale switch without page reload.
 * - The `t(key)` function returns the translated string or the key itself as fallback.
 */
export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    persistLocale(newLocale);
  }, []);

  // Persist on initial load if no preference was stored
  useEffect(() => {
    persistLocale(locale);
  }, [locale]);

  const t = useCallback(
    (key: string): string => {
      const dictionary = dictionaries[locale];
      return (dictionary as Record<string, string>)[key] ?? key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Hook to access the I18n context.
 * Must be used within an I18nProvider.
 */
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
