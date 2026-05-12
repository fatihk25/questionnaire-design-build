import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import CompletionPage from '@/pages/CompletionPage';
import { FormProvider } from '@/contexts/FormContext';
import { I18nProvider } from '@/contexts/I18nContext';

// Mock the API service
vi.mock('@/services/api', () => ({
  submitQuestionnaire: vi.fn(),
}));

import { submitQuestionnaire } from '@/services/api';

const mockSubmitQuestionnaire = vi.mocked(submitQuestionnaire);

/**
 * Helper wrapper providing required context providers.
 */
function Wrapper({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <FormProvider>{children}</FormProvider>
    </I18nProvider>
  );
}

describe('CompletionPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner while submitting', () => {
    // Make the submission hang indefinitely
    mockSubmitQuestionnaire.mockReturnValue(new Promise(() => {}));

    render(
      <Wrapper>
        <CompletionPage />
      </Wrapper>
    );

    expect(screen.getByText('Mengirim jawaban...')).toBeInTheDocument();
  });

  it('shows success message after successful submission', async () => {
    mockSubmitQuestionnaire.mockResolvedValue({
      success: true,
      message: 'Success',
      respondentId: 1,
    });

    render(
      <Wrapper>
        <CompletionPage />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Terima Kasih!')).toBeInTheDocument();
    });

    expect(screen.getByText('Jawaban Anda telah berhasil dikirim.')).toBeInTheDocument();
  });

  it('shows error message with retry button on submission failure', async () => {
    mockSubmitQuestionnaire.mockRejectedValue(new Error('Network error'));

    render(
      <Wrapper>
        <CompletionPage />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Terjadi kesalahan saat mengirim jawaban.')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'Coba Lagi' })).toBeInTheDocument();
  });

  it('does not show a back button after successful submission', async () => {
    mockSubmitQuestionnaire.mockResolvedValue({
      success: true,
      message: 'Success',
      respondentId: 1,
    });

    render(
      <Wrapper>
        <CompletionPage />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Terima Kasih!')).toBeInTheDocument();
    });

    // No "Kembali" button should be present
    expect(screen.queryByText('Kembali')).not.toBeInTheDocument();
  });

  it('retries submission when retry button is clicked', async () => {
    const user = userEvent.setup();

    // First call fails, second call succeeds
    mockSubmitQuestionnaire
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        success: true,
        message: 'Success',
        respondentId: 1,
      });

    render(
      <Wrapper>
        <CompletionPage />
      </Wrapper>
    );

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Coba Lagi' })).toBeInTheDocument();
    });

    // Click retry
    await user.click(screen.getByRole('button', { name: 'Coba Lagi' }));

    // Should show success after retry
    await waitFor(() => {
      expect(screen.getByText('Terima Kasih!')).toBeInTheDocument();
    });

    expect(mockSubmitQuestionnaire).toHaveBeenCalledTimes(2);
  });

  it('submits the form data payload from context state', async () => {
    mockSubmitQuestionnaire.mockResolvedValue({
      success: true,
      message: 'Success',
      respondentId: 1,
    });

    render(
      <Wrapper>
        <CompletionPage />
      </Wrapper>
    );

    await waitFor(() => {
      expect(mockSubmitQuestionnaire).toHaveBeenCalledTimes(1);
    });

    // Verify the payload structure matches SubmissionPayload
    const payload = mockSubmitQuestionnaire.mock.calls[0][0];
    expect(payload).toHaveProperty('identity');
    expect(payload).toHaveProperty('answers');
    expect(payload).toHaveProperty('openQuestions');
  });
});
