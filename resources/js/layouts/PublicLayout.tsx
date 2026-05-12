import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PublicHeader } from '@/components/PublicHeader';
import { PublicFooter } from '@/components/PublicFooter';
import { Stepper } from '@/components/Stepper';
import { useForm } from '@/contexts/FormContext';

export function PublicLayout() {
  const { state } = useForm();
  const location = useLocation();

  // Scroll to top on every page change so stepper is always visible
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <PublicHeader />

      {/* Stepper — full width, no gap, directly under navbar */}
      <Stepper currentStep={state.currentStep} />

      {/* Page content */}
      <main className="flex-1 w-full px-4 py-4">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
}
