import { useCallback } from 'react';
import clsx from 'clsx';
import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import type { RiskIndicator } from '@/types/api';
import { Button } from '@/components/ui';

export interface MatrixTableProps {
  questions: RiskIndicator[];
  answers: Record<string, { probability: number | null; impact: number | null }>;
  onAnswer: (questionId: string, field: 'probability' | 'impact', value: number) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const SCALE_VALUES = [0, 1, 2, 3, 4, 5] as const;

/**
 * MatrixTable — Assessment grid for rating risk indicators.
 *
 * Renders a table with probability (0–5) and impact (0–5) radio columns
 * for each risk indicator question. Supports desktop table layout and
 * mobile card-based layout below 768px.
 *
 * Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.8, 8.9
 */
export function MatrixTable({
  questions,
  answers,
  onAnswer,
  isLoading = false,
  error = null,
  onRetry,
}: MatrixTableProps) {
  const handleSelect = useCallback(
    (questionId: string, field: 'probability' | 'impact', value: number) => {
      onAnswer(questionId, field, value);
    },
    [onAnswer]
  );

  // Guard: if questions is not an array, show loading
  if (!Array.isArray(questions)) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-gray-500 dark:text-gray-400">Memuat pertanyaan...</p>
      </div>
    );
  }

  // Error state — show error message with retry button
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" aria-hidden="true" />
        <p className="text-red-600 dark:text-red-400 font-medium" role="alert">
          {error}
        </p>
        {onRetry && (
          <Button variant="secondary" onClick={onRetry}>
            <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
            Coba Lagi
          </Button>
        )}
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
        <p className="text-gray-500 dark:text-gray-400">Memuat pertanyaan...</p>
      </div>
    );
  }

  // Calculate completion counts
  const totalQuestions = (questions ?? []).length;
  const safeQuestions = questions ?? [];
  const probabilityRated = safeQuestions.filter(
    (q) => answers[String(q.id)]?.probability != null
  ).length;
  const impactRated = safeQuestions.filter(
    (q) => answers[String(q.id)]?.impact != null
  ).length;

  return (
    <div className="w-full">
      {/* Completion Summary */}
      <div className="mb-4 flex flex-wrap gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
        <span>
          {probabilityRated}/{totalQuestions} Probability terjawab
        </span>
        <span className="text-gray-400">|</span>
        <span>
          {impactRated}/{totalQuestions} Impact terjawab
        </span>
      </div>

      {/* Desktop Table Layout (hidden below md/768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-2 py-3 text-left font-semibold w-10">No.</th>
              <th className="px-2 py-3 text-left font-semibold min-w-[200px]">
                Indikator Risiko
              </th>
              {SCALE_VALUES.map((v) => (
                <th
                  key={`ph-${v}`}
                  className="px-1 py-3 text-center font-semibold text-primary w-9"
                >
                  P{v}
                </th>
              ))}
              {SCALE_VALUES.map((v) => (
                <th
                  key={`ih-${v}`}
                  className="px-1 py-3 text-center font-semibold text-secondary w-9"
                >
                  I{v}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {safeQuestions.map((question, index) => {
              const qId = String(question.id);
              const answer = answers[qId] || { probability: null, impact: null };
              const isEven = index % 2 === 0;

              return (
                <tr
                  key={question.id}
                  className={clsx(
                    isEven
                      ? 'bg-white dark:bg-gray-900'
                      : 'bg-[var(--color-surface-beige-alt)] dark:bg-gray-800/50'
                  )}
                >
                  <td className="px-2 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </td>
                  <td className="px-2 py-3 text-gray-800 dark:text-gray-200">
                    {question.indicator}
                  </td>
                  {/* Probability circles */}
                  {SCALE_VALUES.map((v) => (
                    <td key={`p-${question.id}-${v}`} className="px-1 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleSelect(qId, 'probability', v)}
                        aria-label={`Probability ${v} for question ${index + 1}`}
                        aria-pressed={answer.probability === v}
                        className={clsx(
                          'inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                          'transition-colors duration-150 cursor-pointer',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50',
                          answer.probability === v
                            ? 'bg-[#025695] text-white shadow-sm'
                            : 'border-2 border-gray-300 text-gray-500 hover:border-primary/50 dark:border-gray-600 dark:text-gray-400'
                        )}
                      >
                        {v}
                      </button>
                    </td>
                  ))}
                  {/* Impact circles */}
                  {SCALE_VALUES.map((v) => (
                    <td key={`i-${question.id}-${v}`} className="px-1 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleSelect(qId, 'impact', v)}
                        aria-label={`Impact ${v} for question ${index + 1}`}
                        aria-pressed={answer.impact === v}
                        className={clsx(
                          'inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                          'transition-colors duration-150 cursor-pointer',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary/50',
                          answer.impact === v
                            ? 'bg-[#1c6775] text-white shadow-sm'
                            : 'border-2 border-gray-300 text-gray-500 hover:border-secondary/50 dark:border-gray-600 dark:text-gray-400'
                        )}
                      >
                        {v}
                      </button>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout (visible below md/768px) */}
      <div className="md:hidden space-y-3">
        {safeQuestions.map((question, index) => {
          const qId = String(question.id);
          const answer = answers[qId] || { probability: null, impact: null };
          const isEven = index % 2 === 0;

          return (
            <div
              key={question.id}
              className={clsx(
                'rounded-[var(--radius-md)] p-4 shadow-[var(--shadow-card)]',
                isEven
                  ? 'bg-white dark:bg-gray-900'
                  : 'bg-[var(--color-surface-beige-alt)] dark:bg-gray-800/50'
              )}
            >
              {/* Question text */}
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                <span className="text-gray-500 dark:text-gray-400 mr-2">{index + 1}.</span>
                {question.indicator}
              </p>

              {/* Probability row */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-[#025695] mb-2 uppercase tracking-wide">
                  Probability
                </p>
                <div className="flex gap-2 flex-wrap">
                  {SCALE_VALUES.map((v) => (
                    <button
                      key={`mp-${question.id}-${v}`}
                      type="button"
                      onClick={() => handleSelect(qId, 'probability', v)}
                      aria-label={`Probability ${v} for question ${index + 1}`}
                      aria-pressed={answer.probability === v}
                      className={clsx(
                        'inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold',
                        'transition-colors duration-150 cursor-pointer',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50',
                        answer.probability === v
                          ? 'bg-[#025695] text-white shadow-sm'
                          : 'border-2 border-gray-300 text-gray-500 hover:border-primary/50 dark:border-gray-600 dark:text-gray-400'
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Impact row */}
              <div>
                <p className="text-xs font-semibold text-[#1c6775] mb-2 uppercase tracking-wide">
                  Impact
                </p>
                <div className="flex gap-2 flex-wrap">
                  {SCALE_VALUES.map((v) => (
                    <button
                      key={`mi-${question.id}-${v}`}
                      type="button"
                      onClick={() => handleSelect(qId, 'impact', v)}
                      aria-label={`Impact ${v} for question ${index + 1}`}
                      aria-pressed={answer.impact === v}
                      className={clsx(
                        'inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold',
                        'transition-colors duration-150 cursor-pointer',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary/50',
                        answer.impact === v
                          ? 'bg-[#1c6775] text-white shadow-sm'
                          : 'border-2 border-gray-300 text-gray-500 hover:border-secondary/50 dark:border-gray-600 dark:text-gray-400'
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MatrixTable;
