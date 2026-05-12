import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

import IntroPage from '@/pages/IntroPage';
import ConsentPage from '@/pages/ConsentPage';
import IdentityPage from '@/pages/IdentityPage';
import AssessmentIntroPage from '@/pages/AssessmentIntroPage';
import PhasePage from '@/pages/PhasePage';
import OpenQuestionPage from '@/pages/OpenQuestionPage';
import CompletionPage from '@/pages/CompletionPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

/**
 * Application route configuration.
 *
 * Public routes are wrapped with PublicLayout (header, stepper, footer).
 * Admin routes are wrapped with AdminLayout and protected by ProtectedRoute.
 * The catch-all `*` route renders NotFoundPage without any layout.
 */
export const router = createBrowserRouter([
  {
    // Public routes with PublicLayout
    element: <PublicLayout />,
    children: [
      { index: true, element: <IntroPage /> },
      { path: 'persetujuan', element: <ConsentPage /> },
      { path: 'identitas', element: <IdentityPage /> },
      { path: 'penilaian', element: <AssessmentIntroPage /> },
      { path: 'fase/:phaseKey', element: <PhasePage /> },
      { path: 'pertanyaan-terbuka', element: <OpenQuestionPage /> },
      { path: 'selesai', element: <CompletionPage /> },
    ],
  },
  {
    // Admin routes with AdminLayout + authentication protection
    path: 'admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <AdminDashboardPage /> },
    ],
  },
  {
    // Catch-all 404 route
    path: '*',
    element: <NotFoundPage />,
  },
]);

/**
 * AppRouter component wraps the router with RouterProvider.
 * Use this in the App component's provider tree.
 */
export function AppRouter() {
  return <RouterProvider router={router} />;
}
