import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui';

/**
 * NotFoundPage — displayed when the user navigates to an undefined route.
 * Shows a centered 404 message with a link back to the home page.
 *
 * Validates: Requirements 1.4
 */
export function NotFoundPage() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-4xl font-bold text-primary">
        {t('notFound.title')}
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        {t('notFound.message')}
      </p>
      <Link to="/" className="mt-8">
        <Button variant="primary" size="md">
          {t('notFound.backHome')}
        </Button>
      </Link>
    </div>
  );
}
