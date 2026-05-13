import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from '@/contexts/FormContext';
import { useI18n } from '@/contexts/I18nContext';
import { submitQuestionnaire, ApiError } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { SubmissionPayload } from '@/types/api';
import type { PhaseAnswers } from '@/types/questionnaire';

/**
 * Remove incomplete answers (where probability OR impact is null)
 * so backend validation doesn't reject them.
 */
function sanitizeAnswers(answers: PhaseAnswers): PhaseAnswers {
  const cleaned: PhaseAnswers = {};

  for (const [phaseKey, questions] of Object.entries(answers)) {
    const validEntries: Record<string, { probability: number; impact: number }> = {};

    for (const [qId, scores] of Object.entries(questions)) {
      if (scores.probability != null && scores.impact != null) {
        validEntries[qId] = {
          probability: scores.probability,
          impact: scores.impact,
        };
      }
    }

    if (Object.keys(validEntries).length > 0) {
      cleaned[phaseKey] = validEntries;
    }
  }

  return cleaned;
}

/**
 * Remove empty open-question answers (backend treats "" as nullable).
 */
function sanitizeOpenQuestions(
  openQuestions: Record<string, string>
): Record<string, string> {
  const cleaned: Record<string, string> = {};
  for (const [id, text] of Object.entries(openQuestions)) {
    if (text && text.trim().length > 0) {
      cleaned[id] = text.trim();
    }
  }
  return cleaned;
}

export default function CompletionPage() {
  const { state, dispatch } = useForm();
  const { t } = useI18n();
  const navigate = useNavigate();
  const submittingRef = useRef(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  const { submissionStatus, identity, answers, openQuestions } = state;

  useEffect(() => {
    dispatch({ type: 'SET_STEP', payload: 10 });
  }, [dispatch]);

  useEffect(() => {
    if (submissionStatus !== 'idle' || submittingRef.current) return;

    async function submit() {
      submittingRef.current = true;
      dispatch({ type: 'SET_SUBMISSION_STATUS', payload: 'submitting' });
      setErrorDetail(null);

      const payload: SubmissionPayload = {
        identity,
        answers: sanitizeAnswers(answers),
        openQuestions: sanitizeOpenQuestions(openQuestions),
      };

      try {
        await submitQuestionnaire(payload);
        dispatch({ type: 'SET_SUBMISSION_STATUS', payload: 'success' });
      } catch (err) {
        // Capture the specific backend error so the user knows what went wrong
        if (err instanceof ApiError) {
          setErrorDetail(err.message);
        } else if (err instanceof Error) {
          setErrorDetail(err.message);
        } else {
          setErrorDetail(null);
        }
        dispatch({ type: 'SET_SUBMISSION_STATUS', payload: 'error' });
        submittingRef.current = false;
      }
    }

    submit();
  }, [submissionStatus, identity, answers, openQuestions, dispatch]);

  const handleRetry = () => {
    setErrorDetail(null);
    dispatch({ type: 'SET_SUBMISSION_STATUS', payload: 'idle' });
  };

  // Submitting / idle
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

  // Success
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
          <Button
            variant="primary"
            className="mt-6"
            onClick={() => {
              dispatch({ type: 'RESET_FORM' });
              navigate('/');
            }}
          >
            Kembali ke Beranda
          </Button>
        </Card>
      </div>
    );
  }

  // Error
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
        {errorDetail && (
          <p className="mt-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
            {errorDetail}
          </p>
        )}
        <Button variant="primary" className="mt-6" onClick={handleRetry}>
          {t('button.retry')}
        </Button>
      </Card>
    </div>
  );
}
