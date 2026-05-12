import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { fetchAverageScores } from '@/services/api';
import type { IndicatorScore } from '@/types/api';
import type { PhaseKey } from '@/types/questionnaire';
import { getRiskColor } from './RiskMatrix';

export interface AverageScoreTableProps {
  phase: PhaseKey;
}

/**
 * Returns the progress bar color for a given average score using the risk level color scheme.
 *
 * Color mapping:
 * - 0: gray (#9e9e9e / --color-risk-none)
 * - 1–4: green (#4caf50 / --color-risk-low)
 * - 5–9: yellow (#ffeb3b / --color-risk-medium)
 * - 10–15: orange (#ff9800 / --color-risk-high)
 * - 16–25: red (#f44336 / --color-risk-very-high)
 */
function getProgressBarColor(score: number): string {
  return getRiskColor(score);
}

/**
 * Calculates the progress bar width as a percentage of the maximum score (25).
 */
function getProgressBarWidth(score: number): number {
  return (score / 25) * 100;
}

/**
 * AverageScoreTable — Displays average probability, impact, and score per risk indicator.
 *
 * Renders a table with columns: #, Aspek, Indikator Risiko, Avg Probability, Avg Severity, Avg Score.
 * The Avg Score column includes a color-coded progress bar representing the score relative to the maximum (25).
 *
 * Validates: Requirements 15.1, 15.2, 15.3
 */
export function AverageScoreTable({ phase }: AverageScoreTableProps) {
  const [indicators, setIndicators] = useState<IndicatorScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchAverageScores(phase);
        if (!cancelled) {
          setIndicators(Array.isArray(result) ? result : []);
        }
      } catch (err) {
        if (!cancelled) {
          setIndicators([]);
          setError(
            err instanceof Error ? err.message : 'Gagal memuat data rata-rata skor'
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [phase]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
        <p className="text-gray-500 dark:text-gray-400">Memuat data rata-rata skor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <p className="text-red-600 dark:text-red-400 font-medium" role="alert">
          {error}
        </p>
      </div>
    );
  }

  if (indicators.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
        Belum ada data rata-rata skor.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <tr>
            <th className="px-4 py-3 w-12">#</th>
            <th className="px-4 py-3">Aspek</th>
            <th className="px-4 py-3">Indikator Risiko</th>
            <th className="px-4 py-3 text-center">Avg Probability</th>
            <th className="px-4 py-3 text-center">Avg Severity</th>
            <th className="px-4 py-3 min-w-[180px]">Avg Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {indicators.map((indicator, index) => {
            const barWidth = getProgressBarWidth(indicator.avgScore);
            const barColor = getProgressBarColor(indicator.avgScore);

            return (
              <tr
                key={indicator.id}
                className="bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                  {index + 1}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {indicator.aspect}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {indicator.indicator}
                </td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                  {indicator.avgProbability.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                  {indicator.avgImpact.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 rounded-sm flex-1 bg-gray-100 dark:bg-gray-700 overflow-hidden"
                      role="progressbar"
                      aria-valuenow={indicator.avgScore}
                      aria-valuemin={0}
                      aria-valuemax={25}
                      aria-label={`Average score: ${indicator.avgScore.toFixed(2)}`}
                    >
                      <div
                        className="h-full rounded-sm transition-all duration-300"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: barColor,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300 min-w-[40px] text-right">
                      {indicator.avgScore.toFixed(2)}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
