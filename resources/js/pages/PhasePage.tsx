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

const PHASE_STEP_MAP: Record<string, number> = {
  inisiasi: 5,
  perencanaan: 6,
  perancangan: 7,
  pelaksanaan: 8,
  penggunaan: 9,
};

const PHASE_ORDER: PhaseKey[] = [
  'inisiasi',
  'perencanaan',
  'perancangan',
  'pelaksanaan',
  'penggunaan',
];

const PHASE_TITLES: Record<PhaseKey, string> = {
  inisiasi: 'Penilaian pada Fase Inisiasi (Idea)',
  perencanaan: 'Penilaian pada Fase Perencanaan (Planning)',
  perancangan: 'Penilaian pada Fase Perancangan Desain (Design)',
  pelaksanaan: 'Penilaian pada Fase Pelaksanaan (Construction)',
  penggunaan: 'Penilaian pada Fase Penggunaan (O&M)',
};

const PHASE_INTRO: Record<PhaseKey, { topic: string }> = {
  inisiasi: { topic: 'inisiasi (Idea)' },
  perencanaan: { topic: 'perencanaan (Planning)' },
  perancangan: { topic: 'perancangan desain (Design)' },
  pelaksanaan: { topic: 'pelaksanaan (Construction)' },
  penggunaan: { topic: 'penggunaan (O&M)' },
};

export default function PhasePage() {
  const { phaseKey } = useParams<{ phaseKey: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useForm();
  const { t } = useI18n();

  const [questions, setQuestions] = useState<RiskIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const validPhaseKey =
    phaseKey && phaseKey in PHASE_STEP_MAP ? (phaseKey as PhaseKey) : null;

  useEffect(() => {
    if (validPhaseKey) {
      dispatch({ type: 'SET_STEP', payload: PHASE_STEP_MAP[validPhaseKey] });
    }
  }, [validPhaseKey, dispatch]);

  const loadQuestions = useCallback(async () => {
    if (!validPhaseKey) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetchQuestions(validPhaseKey);
      setQuestions(Array.isArray(response.questions) ? response.questions : []);
    } catch (err) {
      setQuestions([]);
      setError(err instanceof Error ? err.message : 'Gagal memuat pertanyaan.');
    } finally {
      setLoading(false);
    }
  }, [validPhaseKey]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

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

  const phaseAnswers = validPhaseKey ? state.answers[validPhaseKey] || {} : {};

  if (!validPhaseKey) {
    return (
      <div className="mx-auto max-w-3xl p-4 md:p-8 text-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-3" />
          <p className="text-red-700 font-medium">
            Fase tidak valid: &quot;{phaseKey}&quot;
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-4 md:p-8">
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-sm text-gray-600">Memuat pertanyaan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl p-4 md:p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-3" />
          <p className="text-red-700 font-medium mb-4">{error}</p>
          <Button variant="primary" onClick={loadQuestions}>
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  const intro = PHASE_INTRO[validPhaseKey];

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-4">
      {/* Phase Title with emoji */}
      <div className="rounded-lg bg-white border border-gray-200 p-5 mb-4">
        <h1 className="flex items-center gap-2 font-display text-lg md:text-xl font-bold text-gray-900">
          <span>📋</span>
          {PHASE_TITLES[validPhaseKey]}
        </h1>
        <div className="mt-3 text-xs text-gray-600 space-y-1">
          <p>
            <span className="font-semibold mr-1">a.</span>
            Seberapa sering kondisi tersebut terjadi pada proyek{' '}
            <em>Design and Build?</em>
          </p>
          <p>
            <span className="font-semibold mr-1">b.</span>
            Jika kondisi tersebut terjadi, seberapa parah dampaknya terhadap
            proyek {intro.topic}?
          </p>
        </div>
      </div>

      {/* Matrix Table */}
      <MatrixTable
        questions={questions}
        answers={phaseAnswers}
        onAnswer={handleAnswer}
      />

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 mt-4">
        <Button variant="secondary" onClick={handleBack}>
          ← {t('button.previous')}
        </Button>
        <Button variant="primary" onClick={handleContinue}>
          {t('button.next')} →
        </Button>
      </div>
    </div>
  );
}
