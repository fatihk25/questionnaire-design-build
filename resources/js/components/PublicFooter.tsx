import { useI18n } from '@/contexts/I18nContext';

/**
 * PublicFooter — centered copyright text at the bottom of the page.
 */
export function PublicFooter() {
  const { t } = useI18n();

  return (
    <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
      <p>{t('footer.copyright')}</p>
    </footer>
  );
}
