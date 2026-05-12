import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Top-level error boundary that catches unhandled React rendering errors.
 * Displays a friendly fallback UI with a reload action.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-surface p-8 dark:bg-gray-900">
          <h1 className="mb-4 font-display text-2xl font-bold text-gray-900 dark:text-gray-100">
            Terjadi Kesalahan
          </h1>
          <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
            Maaf, terjadi kesalahan yang tidak terduga. Silakan muat ulang halaman.
          </p>
          <button
            onClick={this.handleReload}
            className="rounded-lg bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90"
          >
            Muat Ulang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
