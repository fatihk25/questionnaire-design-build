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
 * MatrixTable — Assessment grid matching the reference design.
 *
 * Desktop layout:
 * - Numbered rows with alternating white/beige backgrounds
 * - Two column groups: PROBABILITY (blue header, 0–5) and IMPACT (teal header, 0–5)
 * - Each scale shows end labels: "Tidak Pernah 0" and "Sangat Sering 5"
 * - Circular number buttons: filled blue for selected probability, filled teal for impact
 * - Completion counters at bottom: "X/Y Probability terjawab | X/Y Impact terjawab"
 *
 * Mobile: card-based vertical layout below 768px.
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

  if (!Array.isArray(questions)) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-gray-500">
        Memuat pertanyaan...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-600 font-medium" role="alert">{error}</p>
        {onRetry && (
          <Button variant="secondary" onClick={onRetry}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Coba Lagi
          </Button>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-gray-500">Memuat pertanyaan...</p>
      </div>
    );
  }

  const safeQuestions = questions ?? [];
  const total = safeQuestions.length;
  const probabilityRated = safeQuestions.filter(
    (q) => answers[String(q.id)]?.probability != null
  ).length;
  const impactRated = safeQuestions.filter(
    (q) => answers[String(q.id)]?.impact != null
  ).length;

  return (
    <div className="w-full">
      {/* Desktop layout */}
      <div className="hidden md:block">
        <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
          <table className="w-full text-sm">
            {/* Double header row */}
            <thead>
              {/* Top header: "No.", "Pertanyaan", "KEKERAPAN TERJADI", "KEPARAHAN DAMPAK" */}
              <tr className="bg-gray-50 border-b border-gray-200">
                <th rowSpan={2} className="px-3 py-3 text-center text-xs font-semibold text-gray-600 w-10 align-bottom">
                  No.
                </th>
                <th rowSpan={2} className="px-3 py-3 text-left text-xs font-semibold text-gray-600 min-w-[260px] align-bottom">
                  Pertanyaan
                </th>
                <th colSpan={6} className="px-3 py-2 text-center text-[11px] font-bold text-[#025695] uppercase tracking-wide border-l border-gray-200">
                  A. Kekerapan Terjadi (Probability) (1-5)
                </th>
                <th colSpan={6} className="px-3 py-2 text-center text-[11px] font-bold text-[#1c6775] uppercase tracking-wide border-l border-gray-200">
                  B. Keparahan Dampak (Impact) (1-5)
                </th>
              </tr>
              {/* Sub header: 0-5 scales with end labels */}
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-600">
                {/* Probability 0-5 */}
                <th className="py-2 text-center border-l border-gray-200 w-14">
                  <div className="font-semibold leading-tight">Tidak</div>
                  <div className="leading-tight">Terjadi</div>
                  <div className="mt-1 font-bold text-gray-700">0</div>
                </th>
                <th className="py-2 text-center w-12">
                  <div className="leading-tight">Jarang</div>
                  <div className="mt-1 font-bold text-gray-700">1</div>
                </th>
                <th className="py-2 text-center w-10 font-bold text-gray-700 align-bottom">2</th>
                <th className="py-2 text-center w-10 font-bold text-gray-700 align-bottom">3</th>
                <th className="py-2 text-center w-10 font-bold text-gray-700 align-bottom">4</th>
                <th className="py-2 text-center w-14">
                  <div className="font-semibold leading-tight">Sangat</div>
                  <div className="leading-tight">Sering</div>
                  <div className="mt-1 font-bold text-gray-700">5</div>
                </th>
                {/* Impact 0-5 */}
                <th className="py-2 text-center border-l border-gray-200 w-14">
                  <div className="font-semibold leading-tight">Tidak</div>
                  <div className="leading-tight">Berdampak</div>
                  <div className="mt-1 font-bold text-gray-700">0</div>
                </th>
                <th className="py-2 text-center w-12">
                  <div className="leading-tight">Ringan</div>
                  <div className="mt-1 font-bold text-gray-700">1</div>
                </th>
                <th className="py-2 text-center w-10 font-bold text-gray-700 align-bottom">2</th>
                <th className="py-2 text-center w-10 font-bold text-gray-700 align-bottom">3</th>
                <th className="py-2 text-center w-10 font-bold text-gray-700 align-bottom">4</th>
                <th className="py-2 text-center w-14">
                  <div className="font-semibold leading-tight">Sangat</div>
                  <div className="leading-tight">Parah</div>
                  <div className="mt-1 font-bold text-gray-700">5</div>
                </th>
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
                      'border-b border-gray-100 last:border-0',
                      isEven ? 'bg-white' : 'bg-[#f9f6f0]'
                    )}
                  >
                    <td className="px-3 py-3 text-center text-xs font-medium text-gray-500 align-top">
                      {index + 1}
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-700 leading-relaxed">
                      {question.indicator}
                    </td>
                    {/* Probability radios */}
                    {SCALE_VALUES.map((v, i) => (
                      <td
                        key={`p-${question.id}-${v}`}
                        className={clsx(
                          'py-3 px-1 text-center align-middle',
                          i === 0 && 'border-l border-gray-200'
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => handleSelect(qId, 'probability', v)}
                          aria-label={`Probability ${v} for question ${index + 1}`}
                          aria-pressed={answer.probability === v}
                          className={clsx(
                            'inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer',
                            answer.probability === v
                              ? 'bg-[#025695] text-white shadow-sm scale-110'
                              : 'border border-gray-300 text-gray-400 bg-white hover:border-[#025695]/50 hover:text-gray-600'
                          )}
                        >
                          {v}
                        </button>
                      </td>
                    ))}
                    {/* Impact radios */}
                    {SCALE_VALUES.map((v, i) => (
                      <td
                        key={`i-${question.id}-${v}`}
                        className={clsx(
                          'py-3 px-1 text-center align-middle',
                          i === 0 && 'border-l border-gray-200'
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => handleSelect(qId, 'impact', v)}
                          aria-label={`Impact ${v} for question ${index + 1}`}
                          aria-pressed={answer.impact === v}
                          className={clsx(
                            'inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer',
                            answer.impact === v
                              ? 'bg-[#1c6775] text-white shadow-sm scale-110'
                              : 'border border-gray-300 text-gray-400 bg-white hover:border-[#1c6775]/50 hover:text-gray-600'
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

        {/* Completion summary cards below the table */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-[#025695]/5 border border-[#025695]/20 p-3">
            <p className="text-[10px] uppercase tracking-wide text-[#025695] font-semibold">
              Kekerapan Terjadi — Dinilai
            </p>
            <p className="mt-1 text-2xl font-display font-bold text-[#025695]">
              {probabilityRated}/{total}
            </p>
          </div>
          <div className="rounded-lg bg-[#1c6775]/5 border border-[#1c6775]/20 p-3">
            <p className="text-[10px] uppercase tracking-wide text-[#1c6775] font-semibold">
              Keparahan Dampak — Dinilai
            </p>
            <p className="mt-1 text-2xl font-display font-bold text-[#1c6775]">
              {impactRated}/{total}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden space-y-3">
        {safeQuestions.map((question, index) => {
          const qId = String(question.id);
          const answer = answers[qId] || { probability: null, impact: null };

          return (
            <div key={question.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-xs font-medium text-gray-800 mb-3">
                <span className="text-gray-500 mr-2">{index + 1}.</span>
                {question.indicator}
              </p>
              <div className="mb-3">
                <p className="text-[10px] font-semibold text-[#025695] mb-1.5 uppercase tracking-wide">
                  Kekerapan Terjadi
                </p>
                <div className="flex gap-1.5">
                  {SCALE_VALUES.map((v) => (
                    <button
                      key={`mp-${question.id}-${v}`}
                      type="button"
                      onClick={() => handleSelect(qId, 'probability', v)}
                      aria-pressed={answer.probability === v}
                      className={clsx(
                        'inline-flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold transition-colors',
                        answer.probability === v
                          ? 'bg-[#025695] text-white'
                          : 'border border-gray-300 text-gray-400 bg-white'
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#1c6775] mb-1.5 uppercase tracking-wide">
                  Keparahan Dampak
                </p>
                <div className="flex gap-1.5">
                  {SCALE_VALUES.map((v) => (
                    <button
                      key={`mi-${question.id}-${v}`}
                      type="button"
                      onClick={() => handleSelect(qId, 'impact', v)}
                      aria-pressed={answer.impact === v}
                      className={clsx(
                        'inline-flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold transition-colors',
                        answer.impact === v
                          ? 'bg-[#1c6775] text-white'
                          : 'border border-gray-300 text-gray-400 bg-white'
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
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-[#025695]/5 border border-[#025695]/20 p-2 text-center">
            <p className="text-[9px] uppercase text-[#025695] font-semibold">Probability</p>
            <p className="text-lg font-bold text-[#025695]">{probabilityRated}/{total}</p>
          </div>
          <div className="rounded-lg bg-[#1c6775]/5 border border-[#1c6775]/20 p-2 text-center">
            <p className="text-[9px] uppercase text-[#1c6775] font-semibold">Impact</p>
            <p className="text-lg font-bold text-[#1c6775]">{impactRated}/{total}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatrixTable;
