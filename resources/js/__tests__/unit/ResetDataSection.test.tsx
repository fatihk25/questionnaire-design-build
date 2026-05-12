import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ResetDataSection } from '@/components/admin/ResetDataSection';
import { I18nProvider } from '@/contexts/I18nContext';

// Mock the api service
vi.mock('@/services/api', () => ({
  resetPhaseData: vi.fn(),
}));

import { resetPhaseData } from '@/services/api';

const mockedResetPhaseData = vi.mocked(resetPhaseData);

function renderWithProviders() {
  return render(
    <I18nProvider>
      <ResetDataSection />
    </I18nProvider>
  );
}

describe('ResetDataSection', () => {
  let confirmSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    confirmSpy = vi.spyOn(window, 'confirm');
  });

  afterEach(() => {
    confirmSpy.mockRestore();
  });

  it('renders 5 reset buttons, one per phase', () => {
    renderWithProviders();

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);

    // Check phase labels are present (Indonesian default)
    expect(screen.getByText('Inisiasi')).toBeInTheDocument();
    expect(screen.getByText('Perencanaan')).toBeInTheDocument();
    expect(screen.getByText('Perancangan')).toBeInTheDocument();
    expect(screen.getByText('Pelaksanaan')).toBeInTheDocument();
    expect(screen.getByText('Penggunaan')).toBeInTheDocument();
  });

  it('renders a section heading', () => {
    renderWithProviders();

    expect(screen.getByRole('heading', { name: 'Reset Data' })).toBeInTheDocument();
  });

  it('shows confirmation dialog when a reset button is clicked', async () => {
    confirmSpy.mockReturnValue(false);
    const user = userEvent.setup();

    renderWithProviders();

    await user.click(screen.getByRole('button', { name: /Inisiasi/i }));

    expect(confirmSpy).toHaveBeenCalledWith(
      'Apakah Anda yakin ingin mereset data? Tindakan ini tidak dapat dibatalkan.'
    );
  });

  it('does not call API when confirmation is cancelled', async () => {
    confirmSpy.mockReturnValue(false);
    const user = userEvent.setup();

    renderWithProviders();

    await user.click(screen.getByRole('button', { name: /Inisiasi/i }));

    expect(mockedResetPhaseData).not.toHaveBeenCalled();
  });

  it('calls resetPhaseData with correct phase on confirmation', async () => {
    confirmSpy.mockReturnValue(true);
    mockedResetPhaseData.mockResolvedValue(undefined);
    const user = userEvent.setup();

    renderWithProviders();

    await user.click(screen.getByRole('button', { name: /Perencanaan/i }));

    expect(mockedResetPhaseData).toHaveBeenCalledWith('perencanaan');
  });

  it('shows success feedback after successful reset', async () => {
    confirmSpy.mockReturnValue(true);
    mockedResetPhaseData.mockResolvedValue(undefined);
    const user = userEvent.setup();

    renderWithProviders();

    await user.click(screen.getByRole('button', { name: /Inisiasi/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Data berhasil direset.');
    });
  });

  it('shows error feedback after failed reset', async () => {
    confirmSpy.mockReturnValue(true);
    mockedResetPhaseData.mockRejectedValue(new Error('Network error'));
    const user = userEvent.setup();

    renderWithProviders();

    await user.click(screen.getByRole('button', { name: /Inisiasi/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Gagal mereset data. Silakan coba lagi.');
    });
  });

  it('disables the button while loading', async () => {
    confirmSpy.mockReturnValue(true);
    // Create a promise that we control
    let resolveReset: () => void;
    mockedResetPhaseData.mockImplementation(
      () => new Promise<void>((resolve) => { resolveReset = resolve; })
    );
    const user = userEvent.setup();

    renderWithProviders();

    await user.click(screen.getByRole('button', { name: /Inisiasi/i }));

    // Button should be disabled while loading
    const button = screen.getByRole('button', { name: /Inisiasi/i });
    expect(button).toBeDisabled();

    // Resolve the promise to clean up
    resolveReset!();
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it('has accessible aria-labels on buttons', () => {
    renderWithProviders();

    expect(screen.getByLabelText('Reset Data Inisiasi')).toBeInTheDocument();
    expect(screen.getByLabelText('Reset Data Perencanaan')).toBeInTheDocument();
    expect(screen.getByLabelText('Reset Data Perancangan')).toBeInTheDocument();
    expect(screen.getByLabelText('Reset Data Pelaksanaan')).toBeInTheDocument();
    expect(screen.getByLabelText('Reset Data Penggunaan')).toBeInTheDocument();
  });
});
