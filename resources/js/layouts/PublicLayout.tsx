import { Outlet } from 'react-router-dom';
import { PublicHeader } from '@/components/PublicHeader';
import { PublicFooter } from '@/components/PublicFooter';
import { Stepper } from '@/components/Stepper';
import { useForm } from '@/contexts/FormContext';

/**
 * PublicLayout — wraps all public-facing pages with a consistent
 * header, stepper, page content outlet, and footer.
 *
 * Responsive layout (mobile-first):
 * - Mobile (<768px): 16px horizontal margins, 4-column grid
 * - Tablet (768px–1199px): 24px horizontal margins, 8-column grid
 * - Desktop (≥1200px): 40px horizontal margins, 12-column grid, max-width 1200px
 */
export function PublicLayout() {
  const { state } = useForm();

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <PublicHeader />

      {/* Stepper — hidden on Step 1 (handled internally by Stepper component) */}
      <div className="mx-auto w-full max-w-[700px] px-4">
        <Stepper currentStep={state.currentStep} />
      </div>

      {/* Page content */}
      <main className="mx-auto w-full max-w-[700px] flex-1 px-4 py-6">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
}
