import { useEffect, useRef } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from '@/contexts/FormContext';
import { useI18n } from '@/contexts/I18nContext';
import { submitQuestionnaire } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { SubmissionPayload } from '@/types/api';

/**
 * CompletionPage (Step 10 – Selesai)
 *
 * On mount:
 * 1. Dispatches SET_STEP(10)
 * 2. If submissionStatus is 'idle', submits all form data to the API
 * 3. On success: dispatches SET_SUBMISSION_STATUS('success')
 * 4. On failure: dispatches SET_SUBMISSION_STATUS('error')
 *
 * Display states:
 * - submitting: loading spinner with "Mengirim jawaban..."
 * - success: thank-you message with CheckCircle icon
 * - error: error message with AlertCircle icon and retry button
 *
 * After successful submission, backward navigation is disabled (no "Kembali" button).
 *
 * Validates: Requirements 10.1, 10.2, 10.3, 10.4
 */
export default function CompletionPage() {
  const { state, dispatch } = useForm();
  const { t } = useI18n();
  const submittingRef = useRef(false);

  const { submissionStatus, identity, answers, openQuestions } = state;

  // Set step to 10 on mount
  useEffect(() => {
    dispatch({ type: 'SET_STEP', payload: 10 });
  }, [dispatch]);

  // Submit questionnaire data when status is idle
  useEffect(() => {
    if (submissionStatus !== 'idle' || submittingRef.current) return;

    async function submit() {
      submittingRef.current = true;
      dispatch({ type: 'SET_SUBMISSION_STATUS', payload: 'submitting' });

      const payload: SubmissionPayload = {
        identity,
        answers,
        openQuestions,
      };

      try {
        await submitQuestionnaire(payload);
        dispatch({ type: 'SET_SUBMISSION_STATUS', payload: 'success' });
      } catch {
        dispatch({ type: 'SET_SUBMISSION_STATUS', payload: 'error' });
        submittingRef.current = false;
      }
    }

    submit();
  }, [submissionStatus, identity, answers, openQuestions, dispatch]);

  // Retry handler for failed submissions
  const handleRetry = () => {
    dispatch({ type: 'SET_SUBMISSION_STATUS', payload: 'idle' });
  };

  // Submitting state
  if (submissionStatus === 'submitting' || submissionStatus === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Card className="w-full max-w-md p-8 text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
            Mengirim jawaban...
          </p>
        </Card>
      </div>
    );
  }

  // Success state
  if (submissionStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Card className="w-full max-w-md p-8 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
          <h1 className="mt-4 font-display text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('completion.title')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('completion.success')}
          </p>
        </Card>
      </div>
    );
  }

  // Error state
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Card className="w-full max-w-md p-8 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-red-600" />
        <h1 className="mt-4 font-display text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t('completion.error')}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t('error.submission')}
        </p>
        <Button
          variant="primary"
          className="mt-6"
          onClick={handleRetry}
        >
          {t('button.retry')}
        </Button>
      </Card>
    </div>
  );
}
