import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { I18nProvider } from '@/contexts/I18nContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { FormProvider } from '@/contexts/FormContext';
import { AppRouter } from '@/router';

/**
 * Root application component composing all providers in the correct hierarchy:
 *
 * 1. ErrorBoundary — catches React rendering errors
 * 2. ThemeProvider — dark mode state
 * 3. I18nProvider — internationalization / translations
 * 4. AuthProvider — authentication state
 * 5. FormProvider — questionnaire form state
 * 6. AppRouter — React Router (RouterProvider)
 */
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <I18nProvider>
          <AuthProvider>
            <FormProvider>
              <AppRouter />
            </FormProvider>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
