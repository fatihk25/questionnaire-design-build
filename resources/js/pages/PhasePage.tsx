import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { MatrixTable } from '@/components/MatrixTable';
import { useForm } from '@/contexts/FormContext';
import { useI18n } from '@/contexts/I18nContext';
import { fetchQuestions } from '@/services/api';
import type { RiskIndicator } from '@/types/api';
import type { PhaseKey } from '@/types/questionnaire';

/**
 * Valid phase keys and their corresponding step numbers.
 */
const PHASE_STEP_MAP: Record<string, number> = {
  inisiasi: 5,
  perencanaan: 6,
  perancangan: 7,
  pelaksanaan: 8,
  penggunaan: 9,
};

/**
 * Ordered list of phase keys for navigation sequencing.
 */
const PHASE_ORDER: PhaseKey[] = [
  'inisiasi',
  'perencanaan',
  'perancangan',
  'pelaksanaan',
  'penggunaan',
];

/**
 * Phase display titles for the page heading.
 */
const PHASE_TITLES: Record<PhaseKey, string> = {
  inisiasi: 'Fase Inisiasi (Idea)',
  perencanaan: 'Fase Perencanaan (Planning)',
  perancangan: 'Fase Perancangan Desain (Design)',
  pelaksanaan: 'Fase Pelaksanaan (Construction)',
  penggunaan: 'Fase Penggunaan (Operation & Maintenance)',
};

/**
 * PhasePage — Steps 5–9 (Phase Assessment)
 *
 * Fetches risk indicator questions for the current phase from the API,
 * renders them in a MatrixTable, and wires answer selections to FormContext.
 * Handles loading and error states with retry capability.
 */
export default function PhasePage() {
  const { phaseKey } = useParams<{ phaseKey: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useForm();
  const { t } = useI18n();

  const [questions, setQuestions] = useState<RiskIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Validate phaseKey
  const validPhaseKey = phaseKey && phaseKey in PHASE_STEP_MAP ? (phaseKey as PhaseKey) : null;

  // Set current step on mount or phase change
  useEffect(() => {
    if (validPhaseKey) {
      dispatch({ type: 'SET_STEP', payload: PHASE_STEP_MAP[validPhaseKey] });
    }
  }, [validPhaseKey, dispatch]);

  // Fetch questions from API on mount or phase change
  const loadQuestions = useCallback(async () => {
    if (!validPhaseKey) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetchQuestions(validPhaseKey);
      setQuestions(response.questions);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal memuat pertanyaan.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [validPhaseKey]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  // Handle answer selection — dispatch SET_ANSWER to FormContext
  const handleAnswer = useCallback(
    (questionId: string, field: 'probability' | 'impact', value: number) => {
      if (!validPhaseKey) return;
      dispatch({
        type: 'SET_ANSWER',
        payload: { phase: validPhaseKey, questionId, field, value },
      });
    },
    [validPhaseKey, dispatch]
  );

  // Navigation handlers
  const currentPhaseIndex = validPhaseKey ? PHASE_ORDER.indexOf(validPhaseKey) : -1;

  const handleBack = () => {
    if (currentPhaseIndex <= 0) {
      navigate('/penilaian');
    } else {
      navigate(`/fase/${PHASE_ORDER[currentPhaseIndex - 1]}`);
    }
  };

  const handleContinue = () => {
    if (currentPhaseIndex >= PHASE_ORDER.length - 1) {
      navigate('/pertanyaan-terbuka');
    } else {
      navigate(`/fase/${PHASE_ORDER[currentPhaseIndex + 1]}`);
    }
  };

  // Get current phase answers from FormContext
  const phaseAnswers = validPhaseKey ? (state.answers[validPhaseKey] || {}) : {};

  // Invalid phase key
  if (!validPhaseKey) {
    return (
      <div className="mx-auto max-w-3xl p-4 md:p-8 text-center">
        <div className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-3" />
          <p className="text-red-700 dark:text-red-400 font-medium">
            Fase tidak valid: &quot;{phaseKey}&quot;
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-4 md:p-8">
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Memuat pertanyaan...
          </p>
        </div>
      </div>
    );
  }

  // Error state with retry
  if (error) {
    return (
      <div className="mx-auto max-w-3xl p-4 md:p-8">
        <div className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-3" />
          <p className="text-red-700 dark:text-red-400 font-medium mb-4">
            {error}
          </p>
          <Button variant="primary" onClick={loadQuestions}>
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      {/* Phase Title */}
      <h1 className="font-display text-xl md:text-2xl font-bold text-center mb-2">
        {PHASE_TITLES[validPhaseKey]}
      </h1>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
        Berikan penilaian probabilitas dan dampak untuk setiap indikator risiko berikut.
      </p>

      {/* Matrix Table */}
      <MatrixTable
        questions={questions}
        answers={phaseAnswers}
        onAnswer={handleAnswer}
      />

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button variant="secondary" onClick={handleBack}>
          {t('button.previous')}
        </Button>
        <Button variant="primary" onClick={handleContinue}>
          {t('button.next')}
        </Button>
      </div>
    </div>
  );
}
